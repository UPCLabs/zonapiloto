package grupo4.auth_service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import grupo4.auth_service.entities.User;
import grupo4.auth_service.repositories.UserRepository;
import grupo4.auth_service.services.MfaService;
import grupo4.auth_service.services.MfaService.MfaSetup;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/auth/mfa")
@RequiredArgsConstructor
public class MfaController {

    private final MfaService mfaService;
    private final UserRepository userRepo;

    @PostMapping("/setup")
    public ResponseEntity<?> setupMfa(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        MfaSetup setup = mfaService.generateSetup(username);

        return ResponseEntity.ok(Map.of(
                "secret", setup.secret(),
                "qrUrl", setup.qrUrl()));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyMfa(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        int code = Integer.parseInt(req.get("code"));
        String secret = req.get("secret");

        if (mfaService.verifyCode(secret, code)) {
            User user = userRepo.findByUsername(username).orElseThrow();
            user.setMfaSecret(secret);
            userRepo.save(user);
            return ResponseEntity.ok(Map.of("verified", true));
        } else {
            return ResponseEntity.status(401).body(Map.of("verified", false));
        }
    }
}
