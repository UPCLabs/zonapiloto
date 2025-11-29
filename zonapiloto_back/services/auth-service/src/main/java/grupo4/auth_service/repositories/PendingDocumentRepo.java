package grupo4.auth_service.repositories;

import grupo4.auth_service.entities.PendingDocument;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PendingDocumentRepo
    extends JpaRepository<PendingDocument, Long> {
    List<PendingDocument> findByPendingUserId(Long userId);
}
