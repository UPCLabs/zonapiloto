package grupo4.information_service.repositories;

import grupo4.information_service.entities.CalendaryEvent;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IEventRepo extends JpaRepository<CalendaryEvent, Long> {
    @Query(
        value = "SELECT * FROM calendary_events WHERE state = true",
        nativeQuery = true
    )
    List<CalendaryEvent> findAllActive();

    @Query(
        value = "SELECT * FROM calendary_events WHERE id = :id and state = true",
        nativeQuery = true
    )
    Optional<CalendaryEvent> findByIdActive(@Param("id") Long id);
}
