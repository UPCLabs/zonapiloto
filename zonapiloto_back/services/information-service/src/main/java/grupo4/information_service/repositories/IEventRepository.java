package grupo4.information_service.repositories;

import grupo4.information_service.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IEventRepository extends JpaRepository<Event, Long> {}
