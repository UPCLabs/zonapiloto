package grupo4.information_service.repositories;

import grupo4.information_service.entities.InstitutionalEvent;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IInstitutionalRepo
    extends JpaRepository<InstitutionalEvent, Long> {
    @Query(
        value = "SELECT * FROM institutional_events WHERE state = true",
        nativeQuery = true
    )
    List<InstitutionalEvent> findAllActive();

    @Query(
        value = "SELECT * FROM institutional_events WHERE id = :id AND state = true",
        nativeQuery = true
    )
    Optional<InstitutionalEvent> findByIdActive(@Param("id") Long id);
}
