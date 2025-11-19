package grupo4.auth_service.services;

import grupo4.auth_service.dtos.UserDTO;
import grupo4.auth_service.entities.User;
import grupo4.auth_service.enums.UserRole;
import grupo4.auth_service.repositories.UserRepository;
import grupo4.auth_service.util.UserUtil;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepo;

    public List<UserDTO> getAllUsers() {
        return userRepo
            .findAll()
            .stream()
            .map(user ->
                new UserDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getRole().toString(),
                    user.isMfaPending()
                )
            )
            .toList();
    }

    public boolean userExists(String username) {
        return userRepo.findByUsername(username).isPresent();
    }

    public User getUser(String username) {
        return userRepo.findByUsername(username).orElse(null);
    }

    public User getUser(Long user_id) {
        return userRepo.findById(user_id).orElse(null);
    }

    public void updateUser(User user) {
        userRepo.save(user);
    }

    public void deleteUser(Long user_id) {
        userRepo.deleteById(user_id);
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
