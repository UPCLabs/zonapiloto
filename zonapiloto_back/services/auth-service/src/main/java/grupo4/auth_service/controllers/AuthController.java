package grupo4.auth_service.controllers;

import grupo4.auth_service.entities.User;
import grupo4.auth_service.repositories.UserRepository;
import grupo4.auth_service.services.AuthService;
import grupo4.auth_service.services.MfaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MfaService mfaService;
    private final UserRepository userRepo;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        String role = req.get("role");

        if (userRepo.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Usuario ya existe"));
        }

        var setup = mfaService.generateSetup(username);
        return ResponseEntity.ok(Map.of(
                "username", username,
                "password", password,
                "role", role,
                "mfa_secret", setup.secret(),
                "qr_url", setup.qrUrl()));
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<?> verifyRegistration(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        String role = req.get("role");
        String secret = req.get("mfa_secret");
        int code = Integer.parseInt(req.get("mfa_code"));

        if (mfaService.verifyCode(secret, code)) {
            User user = User.builder()
                    .username(username)
                    .password(password)
                    .role(role)
                    .mfaSecret(secret)
                    .build();
            userRepo.save(user);
            return ResponseEntity.ok(Map.of("message", "Usuario registrado con MFA"));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Código MFA inválido"));
        }
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
