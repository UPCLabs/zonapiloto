package grupo4.auth_service.controllers;

import grupo4.auth_service.entities.PendingUser;
import grupo4.auth_service.services.AuthService;
import grupo4.auth_service.services.MfaService;
import grupo4.auth_service.services.PendingUserService;
import grupo4.auth_service.services.UserService;
import grupo4.auth_service.services.MfaService.MfaSetup;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MfaService mfaService;
    private final UserService userService;
    private final PendingUserService pendingUserService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        String role = req.get("role");

        if (userService.userExists(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Usuario ya existe"));
        }

        MfaSetup setup = mfaService.generateSetup(username);
        pendingUserService.createPendingUser(username, password, role, setup.secret());

        return ResponseEntity.ok(Map.of(
                "mfa_secret", setup.secret(),
                "qr_url", setup.qrUrl()));
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<?> verifyRegistration(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        int code = Integer.parseInt(req.get("mfa_code"));

        Optional<PendingUser> userOptional = pendingUserService.getPendingUser(username);

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Registro ya expiro o nombre de usuario no encontrado"));
        }

        PendingUser user = userOptional.get();

        if (mfaService.verifyCode(user.getMfaSecret(), code)) {
            userService.registerUser(user);
            pendingUserService.deletePendingUser(user.getId());
            return ResponseEntity.ok(Map.of("message", "Usuario registrado con exito"));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Código MFA inválido"));
        }
    }

    @PostMapping("/check-credentials")
    public ResponseEntity<Boolean> checkCredentials(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");

        return ResponseEntity.ok().body(authService.checkCredentials(username, password));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        int code = Integer.parseInt(req.get("mfa_code"));

        String token = authService.loginWithMfa(username, password, code);
        if (token == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas o MFA incorrecto"));
        }

        return ResponseEntity.ok(Map.of("token", token));
    }
}
