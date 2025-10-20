package grupo4.auth_service.services;

import grupo4.auth_service.entities.User;
import grupo4.auth_service.repositories.UserRepository;
import grupo4.auth_service.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.security.MessageDigest;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;
    private final MfaService mfaService;

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    public User registerUser(String username, String password, String role, String secret) {
        String hashed = hashPassword(password);
        User user = User.builder()
                .username(username)
                .password(hashed)
                .role(role)
                .mfaSecret(secret)
                .build();
        return userRepo.save(user);
    }

    public String loginWithMfa(String username, String password, int code) {
        var user = userRepo.findByUsername(username).orElse(null);
        if (user == null)
            return null;

        // String hashed = hashPassword(password);
        if (!user.getPassword().equals(password))
            return null;

        boolean valid = mfaService.verifyCode(user.getMfaSecret(), code);
        if (!valid)
            return null;

        return jwtUtil.generateToken(user);
    }
}
