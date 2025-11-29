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

    public String generateToken(User user) {
        return jwtUtil.generateToken(user);
    }

    public boolean checkCredentials(String email, String password) {
        User user = userService.getUserEntity(email);

        if (user == null) {
            return false;
        }

        return UserUtil.checkPassword(password, user.getPassword());
    }

    public String loginWithMfa(String email, String password, int code) {
        User user = userService.getUserEntity(email);
        if (user == null) {
            return null;
        }

        if (!UserUtil.checkPassword(password, user.getPassword())) {
            return null;
        }

        if (!mfaService.verifyCode(email, user.getMfaSecret(), code)) {
            return null;
        }

        return jwtUtil.generateToken(user);
    }
}
