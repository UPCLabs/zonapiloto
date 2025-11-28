package grupo4.auth_service.controllers;

import grupo4.auth_service.entities.User;
import grupo4.auth_service.services.AuthService;
import grupo4.auth_service.services.MfaService;
import grupo4.auth_service.services.MfaService.MfaSetup;
import grupo4.auth_service.services.UserService;
import grupo4.auth_service.util.EmailCodeCache;
import grupo4.auth_service.util.UserUtil;
import grupo4.common_messaging.email.EmailTemplate;
import grupo4.common_messaging.events.EmailEvent;
import grupo4.common_messaging.publisher.MessagePublisher;
import grupo4.common_messaging.queues.QueuesNames;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MfaService mfaService;
    private final UserService userService;
    private final EmailCodeCache emailCodeVericator;
    private final MessagePublisher messagePublisher;

    @PostMapping("/send-email-code")
    public ResponseEntity<?> sendCode(@RequestBody Map<String, String> req) {
        String email = req.get("email");

        String code = String.valueOf((int) (Math.random() * 900000 + 100000));

        emailCodeVericator.saveCode(email, code);

        EmailEvent emailEvent = EmailEvent.builder()
            .to(email)
            .subject("Código de verificación")
            .template(EmailTemplate.EMAIL_VERIFY)
            .variables(Map.of("code", code))
            .build();

        messagePublisher.send(QueuesNames.EMAIL_QUEUE, emailEvent);

        return ResponseEntity.ok(Map.of("message", "Código enviado"));
    }

    @PostMapping("/verify-email-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String code = req.get("code");

        boolean isValid = emailCodeVericator.validate(email, code);

        if (!isValid) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Código inválido o expirado")
            );
        }

        emailCodeVericator.remove(email);

        return ResponseEntity.ok(Map.of("verified", true));
    }

    @PostMapping("/check-credentials")
    public ResponseEntity<?> checkCredentials(
        @RequestBody Map<String, String> req
    ) {
        String email = req.get("email");
        String password = req.get("password");

        User user = userService.getUserEntity(email);

        if (authService.checkCredentials(email, password)) {
            return ResponseEntity.ok(
                Map.of(
                    "valid",
                    true,
                    "hasMfa",
                    (user.getMfaSecret() != null) && (!user.isMfaPending())
                        ? true
                        : false
                )
            );
        }

        return ResponseEntity.status(401).body(Map.of("valid", false));
    }

    @PostMapping("/confirm-registration")
    public ResponseEntity<?> confirmRegistration(
        @RequestBody Map<String, String> req
    ) {
        String email = req.get("email");
        String password = req.get("password");

        boolean valid = authService.checkCredentials(email, password);
        if (!valid) {
            return ResponseEntity.status(401).body(
                Map.of("error", "Credenciales inválidas")
            );
        }

        User user = userService.getUserEntity(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Usuario no encontrado")
            );
        }

        if (!user.isMfaPending()) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "El usuario ya tiene MFA configurado")
            );
        }

        MfaSetup setup = mfaService.generateSetup(email);
        user.setMfaSecret(setup.secret());
        userService.updateUser(user);

        return ResponseEntity.ok(
            Map.of("qr_url", setup.qrUrl(), "mfa_secret", setup.secret())
        );
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<?> verifyRegistration(
        @RequestBody Map<String, String> req
    ) {
        String email = req.get("email");
        String password = req.get("password");
        String newPassword = req.get("new_password");
        int code = Integer.parseInt(req.get("mfa_code"));

        User user = userService.getUserEntity(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Usuario no encontrado")
            );
        }

        boolean passwordValid = authService.checkCredentials(email, password);
        if (!passwordValid) {
            return ResponseEntity.status(401).body(
                Map.of("error", "Contraseña incorrecta")
            );
        }

        if (user.getMfaSecret() == null) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Usuario no tiene MFA configurado")
            );
        }

        if (!user.isMfaPending()) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Usuario ya confirmo su MFA")
            );
        }

        boolean validCode = mfaService.verifyCode(
            email,
            user.getMfaSecret(),
            code
        );
        if (!validCode) {
            user.setMfaSecret(null);
            userService.updateUser(user);
            return ResponseEntity.status(401).body(
                Map.of(
                    "error",
                    "Código MFA inválido. Se ha eliminado el MFA, por favor configúralo nuevamente."
                )
            );
        }

        user.setMfaPending(false);
        user.setPassword(UserUtil.encryptPassword(newPassword));
        userService.updateUser(user);
        return ResponseEntity.ok(Map.of("message", "Registro completado"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String password = req.get("password");
        int code = Integer.parseInt(req.get("mfa_code"));

        if (!authService.checkCredentials(email, password)) {
            return ResponseEntity.status(401).body(
                Map.of("error", "Credenciales inválidas")
            );
        }

        User user = userService.getUserEntity(email);
        if (user == null) {
            return ResponseEntity.status(404).body(
                Map.of("error", "Usuario no encontrado")
            );
        }

        if (user.getMfaSecret() == null) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "El usuario no tiene MFA configurado")
            );
        }

        boolean validCode = mfaService.verifyCode(
            email,
            user.getMfaSecret(),
            code
        );
        if (!validCode) {
            return ResponseEntity.status(401).body(
                Map.of("error", "Código MFA inválido")
            );
        }

        String token = authService.generateToken(user);

        ResponseCookie cookie = ResponseCookie.from("token", token)
            .httpOnly(true)
            .secure(true)
            .sameSite("None")
            .path("/")
            .maxAge(86400)
            .build();

        return ResponseEntity.ok()
            .header("Set-Cookie", cookie.toString())
            .body(
                Map.of(
                    "user",
                    user.getUsername(),
                    "role",
                    user.getRole().toString()
                )
            );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("token", "")
            .httpOnly(true)
            .secure(true)
            .sameSite("None")
            .path("/")
            .maxAge(0)
            .build();

        return ResponseEntity.ok()
            .header("Set-Cookie", cookie.toString())
            .body(Map.of("message", "Sesión cerrada correctamente"));
    }
}
