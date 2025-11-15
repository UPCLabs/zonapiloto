package grupo4.information_service.interfaces;

import grupo4.information_service.entities.Event;
import grupo4.information_service.entities.EventDTO;
import java.util.List;

public interface IEventService {
    boolean eventExists(Long event_id);
    Event getEvent(Long event_id);
    Event updateEvent(Long event_id, EventDTO eventDTO);
    Event createEvent(EventDTO eventDTO);
    void deleteEvent(Long event_id);
    List<Event> getAllEvents();
}
