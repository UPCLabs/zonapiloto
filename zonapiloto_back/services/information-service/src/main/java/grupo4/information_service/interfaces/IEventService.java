package grupo4.information_service.interfaces;

import grupo4.information_service.dtos.CalendaryEventDTO;
import grupo4.information_service.entities.CalendaryEvent;
import java.util.List;

public interface IEventService {
    boolean eventExists(Long event_id);
    CalendaryEvent getEvent(Long event_id);
    CalendaryEvent updateEvent(Long event_id, CalendaryEventDTO eventDTO);
    CalendaryEvent createEvent(CalendaryEventDTO eventDTO);
    void deleteEvent(Long event_id);
    List<CalendaryEvent> getAllEvents();
}
