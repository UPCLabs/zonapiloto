package grupo4.profile_service.repositories;

import grupo4.profile_service.entities.AcademicHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AcademicHistoryRepository
    extends JpaRepository<AcademicHistory, Long> {
    List<AcademicHistory> findByProfileId(Long profileId);
}
