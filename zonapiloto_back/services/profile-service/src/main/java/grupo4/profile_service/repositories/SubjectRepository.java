package grupo4.profile_service.repositories;

import grupo4.profile_service.entities.Subject;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByProfileId(Long profileId);
}
