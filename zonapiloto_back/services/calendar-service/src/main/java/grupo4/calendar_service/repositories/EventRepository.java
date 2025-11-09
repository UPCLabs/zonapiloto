package grupo4.calendar_service.repositories;

import grupo4.calendar_service.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {}
