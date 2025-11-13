package grupo4.auth_service.util;

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
}
