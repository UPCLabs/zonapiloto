package grupo4.auth_service.services;

import org.springframework.stereotype.Service;

import grupo4.auth_service.entities.PendingUser;
import grupo4.auth_service.entities.User;
import grupo4.auth_service.repositories.UserRepository;
import grupo4.auth_service.util.UserUtil;
import lombok.AllArgsConstructor;

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

    public User registerUser(PendingUser pendingUser) {
        return userRepo.save(UserUtil.fromPendingToUser(pendingUser));
    }
}
