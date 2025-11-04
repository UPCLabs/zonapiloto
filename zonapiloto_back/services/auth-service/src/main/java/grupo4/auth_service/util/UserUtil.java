package grupo4.auth_service.util;

import grupo4.auth_service.entities.PendingUser;
import grupo4.auth_service.entities.User;
import org.mindrot.jbcrypt.BCrypt;

public class UserUtil {

    public static String encryptPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt(12));
    }

    public static boolean checkPassword(
        String plainPassword,
        String encryptedPassword
    ) {
        return BCrypt.checkpw(plainPassword, encryptedPassword);
    }

    public static User fromPendingToUser(PendingUser pendingUser) {
        return User.builder()
            .username(pendingUser.getUsername())
            .password(encryptPassword(pendingUser.getPassword()))
            .mfaSecret(pendingUser.getMfaSecret())
            .role(pendingUser.getRole())
            .build();
    }
}
