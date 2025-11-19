package grupo4.information_service.interfaces;

import grupo4.information_service.dtos.InstitutionalEventDTO;
import grupo4.information_service.entities.InstitutionalEvent;
import java.util.List;

public interface IInstitutionalService {
    boolean eventExists(Long event_id);
    InstitutionalEvent getEvent(Long event_id);
    InstitutionalEvent updateEvent(
        Long event_id,
        InstitutionalEventDTO eventDTO
    );
    InstitutionalEvent createEvent(InstitutionalEventDTO eventDTO);
    void deleteEvent(Long event_id);
    List<InstitutionalEvent> getAllEvents();
}
