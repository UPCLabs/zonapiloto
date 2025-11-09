package grupo4.auth_service.services;

import grupo4.auth_service.entities.User;
import grupo4.auth_service.enums.UserRole;
import grupo4.auth_service.repositories.UserRepository;
import grupo4.auth_service.util.UserUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepo;

    public boolean userExists(String username) {
        return userRepo.findByUsername(username).isPresent();
    }

    public User getUser(String username) {
        return userRepo.findByUsername(username).orElse(null);
    }

    public void updateUser(User user) {
        userRepo.save(user);
    }

    public void createUser(String username, String password, UserRole role) {
        User user = User.builder()
            .username(username)
            .password(UserUtil.encryptPassword(password))
            .role(role)
            .mfaSecret(null)
            .mfaPending(true)
            .build();
        userRepo.save(user);
    }
}
