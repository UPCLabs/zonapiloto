package grupo4.auth_service.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import grupo4.auth_service.entities.PendingUser;
import grupo4.auth_service.repositories.PendingUserRepository;
import grupo4.auth_service.util.UserUtil;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PendingUserService {
    private final PendingUserRepository pendingUserRepo;

    public PendingUser createPendingUser(String username, String password, String role, String secret) {
        PendingUser entity = PendingUser.builder()
                .username(username)
                .password(UserUtil.hashPassword(password))
                .role(role)
                .mfaSecret(secret).build();

        PendingUser pendingUser = pendingUserRepo.save(entity);
        return pendingUser;
    }

    public Optional<PendingUser> getPendingUser(String username) {
        return pendingUserRepo.findByUsername(username);
    }

    public void deletePendingUser(Long id) {
        pendingUserRepo.deleteById(id);
    }
}
