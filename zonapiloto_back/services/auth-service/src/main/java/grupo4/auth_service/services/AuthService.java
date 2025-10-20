package grupo4.auth_service.services;

import grupo4.auth_service.entities.PendingUser;
import grupo4.auth_service.entities.User;
import grupo4.auth_service.repositories.PendingUserRepository;
import grupo4.auth_service.repositories.UserRepository;
import grupo4.auth_service.util.JwtUtil;
import grupo4.auth_service.util.UserUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final MfaService mfaService;

    public boolean checkCredentials(String username, String password) {
        String hashPassword = UserUtil.hashPassword(password);
        User user = userService.getUser(username);

        return user.getPassword().equals(hashPassword);
    }

    public String loginWithMfa(String username, String password, int code) {
        User user = userService.getUser(username);
        if (user == null)
            return null;

        String hashed = UserUtil.hashPassword(password);
        if (!user.getPassword().equals(hashed))
            return null;

        if (!mfaService.verifyCode(user.getMfaSecret(), code))
            return null;

        return jwtUtil.generateToken(user);
    }
}
