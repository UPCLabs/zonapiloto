package grupo4.profile_service.repositories;

import grupo4.profile_service.entities.AcademicProfile;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AcademicProfileRepository
    extends JpaRepository<AcademicProfile, Long> {
    List<AcademicProfile> findByUserId(Long userId);
}
