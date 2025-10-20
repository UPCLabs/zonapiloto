package grupo4.auth_service.util;

import java.security.MessageDigest;
import java.util.Base64;

import grupo4.auth_service.entities.PendingUser;
import grupo4.auth_service.entities.User;

public class UserUtil {

    public static String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    public static User fromPendingToUser(PendingUser pendingUser) {
        return User.builder()
                .username(pendingUser.getUsername())
                .password(pendingUser.getPassword())
                .mfaSecret(pendingUser.getMfaSecret())
                .role(pendingUser.getRole())
                .build();
    }
}
