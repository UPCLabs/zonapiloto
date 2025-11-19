package grupo4.information_service.repositories;

import grupo4.information_service.entities.CalendaryEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IEventRepo extends JpaRepository<CalendaryEvent, Long> {}
