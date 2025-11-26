package grupo4.information_service.interfaces;

import grupo4.information_service.dtos.CalendaryEventDTO;
import grupo4.information_service.entities.CalendaryEvent;
import java.util.List;

public interface IEventService {
    boolean eventExists(Long eventId);
    CalendaryEvent getEvent(Long eventId);
    CalendaryEvent getEventAdmin(Long eventId);
    CalendaryEvent updateEvent(Long eventId, CalendaryEventDTO eventDTO);
    CalendaryEvent createEvent(CalendaryEventDTO eventDTO);
    void deleteEvent(Long eventId);
    List<CalendaryEvent> getAllEvents();
    List<CalendaryEvent> getAllAdminEvents();
}
