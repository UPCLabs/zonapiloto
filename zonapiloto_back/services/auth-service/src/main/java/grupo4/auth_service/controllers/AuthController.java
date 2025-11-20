package grupo4.auth_service.controllers;

import grupo4.auth_service.entities.User;
import grupo4.auth_service.enums.UserRole;
import grupo4.auth_service.services.AuthService;
import grupo4.auth_service.services.MfaService;
import grupo4.auth_service.services.MfaService.MfaSetup;
import grupo4.auth_service.services.UserService;
import grupo4.auth_service.util.UserUtil;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MfaService mfaService;
    private final UserService userService;

    @GetMapping("/users/me")
    public ResponseEntity<?> userInfo(
        @RequestHeader("X-User") String user,
        @RequestHeader("X-Role") String role
    ) {
        User usuario = userService.getUser(user);

        if (usuario == null) {
            ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();

            return ResponseEntity.status(401)
                .header("Set-Cookie", cookie.toString())
                .body("Sesión inválida");
        }

        return ResponseEntity.ok(Map.of("user", user, "role", role));
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        UserRole role = UserRole.valueOf(req.get("role"));

        if (userService.userExists(username)) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Usuario ya existe")
            );
        }

        userService.createUser(username, password, role);

        return ResponseEntity.ok(
            Map.of(
                "message",
                "Usuario creado exitosamente. Pendiente de confirmar registro (configurar MFA)."
            )
        );
    }

    @PutMapping("/users/{user_id}")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> updateUser(
        @RequestBody Map<String, String> req,
        @PathVariable Long user_id
    ) {
        String newUsername = req.get("username");
        String newPassword = req.get("password");
        String newRole = req.get("role");

        User user = userService.getUser(user_id);
        if (user == null) {
            return ResponseEntity.status(404).body(
                Map.of("error", "Usuario no encontrado")
            );
        }

        if (newPassword != null) {
            user.setPassword(UserUtil.encryptPassword(newPassword));
        }

        user.setUsername(newUsername);

        user.setRole(UserRole.valueOf(newRole));

        userService.updateUser(user);
        return ResponseEntity.ok(Map.of("message", "Usuario actualizado"));
    }

    @DeleteMapping("/users/{user_id}")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> deleteUser(
        @RequestHeader("X-User") String requester,
        @PathVariable Long user_id
    ) {
        User user = userService.getUser(user_id);

        if (user == null) {
            return ResponseEntity.status(404).body(
                Map.of("error", "Usuario no encontrado")
            );
        }

        if (requester.equals(user.getUsername())) {
            return ResponseEntity.status(400).body(
                Map.of("error", "No puedes eliminar tu propio usuario")
            );
        }

        userService.deleteUser(user.getId());

        return ResponseEntity.ok(
            Map.of(
                "message",
                "Usuario eliminado correctamente",
                "deletedUser",
                user.getUsername()
            )
        );
    }

    @PostMapping("/check-credentials")
    public ResponseEntity<?> checkCredentials(
        @RequestBody Map<String, String> req
    ) {
        String username = req.get("username");
        String password = req.get("password");

        User user = userService.getUser(username);

        if (authService.checkCredentials(username, password)) {
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
        String username = req.get("username");
        String password = req.get("password");

        boolean valid = authService.checkCredentials(username, password);
        if (!valid) {
            return ResponseEntity.status(401).body(
                Map.of("error", "Credenciales inválidas")
            );
        }

        User user = userService.getUser(username);
        if (user == null) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Usuario no encontrado")
            );
        }

        if (user.getMfaSecret() != null) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "El usuario ya tiene MFA configurado")
            );
        }

        MfaSetup setup = mfaService.generateSetup(username);
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
        String username = req.get("username");
        String password = req.get("password");
        int code = Integer.parseInt(req.get("mfa_code"));

        User user = userService.getUser(username);
        if (user == null) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Usuario no encontrado")
            );
        }

        boolean passwordValid = authService.checkCredentials(
            username,
            password
        );
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
            username,
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
        userService.updateUser(user);
        return ResponseEntity.ok(Map.of("message", "Registro completado"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        int code = Integer.parseInt(req.get("mfa_code"));

        if (!authService.checkCredentials(username, password)) {
            return ResponseEntity.status(401).body(
                Map.of("error", "Credenciales inválidas")
            );
        }

        User user = userService.getUser(username);
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
            username,
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
