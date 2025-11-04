package grupo4.auth_service.services;

import grupo4.auth_service.entities.User;
import grupo4.auth_service.util.JwtUtil;
import grupo4.auth_service.util.UserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final MfaService mfaService;

    public boolean checkCredentials(String username, String password) {
        String hashPassword = UserUtil.encryptPassword(password);
        User user = userService.getUser(username);

        if (user == null) {
            return false;
        }

        return user.getPassword().equals(hashPassword);
    }

    public String loginWithMfa(String username, String password, int code) {
        User user = userService.getUser(username);
        if (user == null) {
            return null;
        }

        if (!UserUtil.checkPassword(password, user.getPassword())) {
            return null;
        }

        if (!mfaService.verifyCode(username, user.getMfaSecret(), code)) {
            return null;
        }

        return jwtUtil.generateToken(user);
    }
}
