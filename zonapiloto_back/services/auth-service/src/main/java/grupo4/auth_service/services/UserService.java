package grupo4.auth_service.services;

import grupo4.auth_service.dtos.UserDTO;
import grupo4.auth_service.dtos.UserDocumentsDTO;
import grupo4.auth_service.entities.User;
import grupo4.auth_service.enums.UserRole;
import grupo4.auth_service.repositories.UserRepository;
import grupo4.auth_service.util.UserUtil;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final UserDocumentService userDocumentService;

    public User createUser(
        String username,
        String email,
        String password,
        UserRole role
    ) {
        User user = User.builder()
            .username(username)
            .email(email)
            .password(UserUtil.encryptPassword(password))
            .role(role)
            .mfaSecret(null)
            .mfaPending(true)
            .build();

        return userRepo.save(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepo
            .findAll()
            .stream()
            .map(user ->
                new UserDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().toString(),
                    user.isMfaPending()
                )
            )
            .toList();
    }

    public UserDTO getUserById(Long id) {
        return userRepo
            .findById(id)
            .map(user ->
                new UserDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().toString(),
                    user.isMfaPending()
                )
            )
            .orElse(null);
    }

    public List<UserDocumentsDTO> getAllWithDocumentsUsers() {
        return userRepo
            .findAll()
            .stream()
            .map(user ->
                new UserDocumentsDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().toString(),
                    userDocumentService.getAll(user.getId())
                )
            )
            .toList();
    }

    public UserDocumentsDTO getUserWithDocumentsById(Long id) {
        return userRepo
            .findById(id)
            .map(user ->
                new UserDocumentsDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().toString(),
                    userDocumentService.getAll(user.getId())
                )
            )
            .orElse(null);
    }

    public User getUserEntity(Long id) {
        return userRepo.findById(id).orElse(null);
    }

    public UserDTO getUserByEmail(String email) {
        return userRepo
            .findByEmail(email)
            .map(user ->
                new UserDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().toString(),
                    user.isMfaPending()
                )
            )
            .orElse(null);
    }

    public User getUserEntity(String email) {
        return userRepo.findByEmail(email).orElse(null);
    }

    public boolean userExists(String email) {
        return userRepo.findByEmail(email).isPresent();
    }

    public User updateUser(
        Long id,
        String username,
        String email,
        UserRole role,
        Boolean mfaPending
    ) {
        Optional<User> optionalUser = userRepo.findById(id);

        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();

        if (username != null) user.setUsername(username);
        if (email != null) user.setEmail(email);
        if (role != null) user.setRole(role);
        if (mfaPending != null) user.setMfaPending(mfaPending);

        return userRepo.save(user);
    }

    public void updateUser(User user) {
        userRepo.save(user);
    }

    public boolean deleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            return false;
        }
        userRepo.deleteById(id);
        return true;
    }
}
