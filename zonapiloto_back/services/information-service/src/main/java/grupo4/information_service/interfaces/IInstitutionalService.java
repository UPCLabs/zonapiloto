package grupo4.information_service.interfaces;

import grupo4.information_service.dtos.InstitutionalEventDTO;
import grupo4.information_service.entities.InstitutionalEvent;
import java.util.List;

public interface IInstitutionalService {
    boolean eventExists(Long eventId);
    InstitutionalEvent getEvent(Long eventId);
    InstitutionalEvent getEventAdmin(Long eventId);
    InstitutionalEvent updateEvent(
        Long eventId,
        InstitutionalEventDTO eventDTO
    );
    InstitutionalEvent createEvent(InstitutionalEventDTO eventDTO);
    void deleteEvent(Long eventId);
    List<InstitutionalEvent> getAllEvents();
    List<InstitutionalEvent> getAllAdminEvents();
}
