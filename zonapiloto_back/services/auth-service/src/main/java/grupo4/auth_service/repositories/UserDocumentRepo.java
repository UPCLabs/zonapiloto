package grupo4.auth_service.repositories;

import grupo4.auth_service.entities.UserDocument;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDocumentRepo extends JpaRepository<UserDocument, Long> {
    List<UserDocument> findByUserId(Long userId);
}
