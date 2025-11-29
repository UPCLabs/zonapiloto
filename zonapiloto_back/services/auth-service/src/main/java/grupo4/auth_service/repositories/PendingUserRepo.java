package grupo4.auth_service.repositories;

import grupo4.auth_service.entities.PendingUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PendingUserRepo extends JpaRepository<PendingUser, Long> {
    Optional<PendingUser> findByEmail(String email);
}
