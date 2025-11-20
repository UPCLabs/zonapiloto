package grupo4.information_service.repositories;

import grupo4.information_service.entities.CalendaryEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface IEventRepo extends JpaRepository<CalendaryEvent, Long> {
    @Query(value = "SELECT * FROM calendary_events", nativeQuery = true)
    List<CalendaryEvent> findAllIncludingInactive();
}
