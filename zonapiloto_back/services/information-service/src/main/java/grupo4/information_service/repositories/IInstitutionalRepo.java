package grupo4.information_service.repositories;

import grupo4.information_service.entities.InstitutionalEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface IInstitutionalRepo
    extends JpaRepository<InstitutionalEvent, Long> {
    @Query(value = "SELECT * FROM institutional_events", nativeQuery = true)
    List<InstitutionalEvent> findAllIncludingInactive();
}
