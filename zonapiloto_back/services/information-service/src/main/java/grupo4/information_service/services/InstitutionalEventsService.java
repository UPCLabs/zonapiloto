package grupo4.information_service.services;

import grupo4.information_service.dtos.InstitutionalEventDTO;
import grupo4.information_service.entities.InstitutionalEvent;
import grupo4.information_service.interfaces.IInstitutionalService;
import grupo4.information_service.repositories.IInstitutionalRepo;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class InstitutionalEventsService implements IInstitutionalService {

    private final IInstitutionalRepo eventRepository;

    @Override
    public boolean eventExists(Long event_id) {
        return eventRepository.existsById(event_id);
    }

    @Override
    public InstitutionalEvent getEvent(Long event_id) {
        return eventRepository.findById(event_id).orElse(null);
    }

    @Override
    public InstitutionalEvent updateEvent(
        Long event_id,
        InstitutionalEventDTO eventDTO
    ) {
        InstitutionalEvent event = eventRepository
            .findById(event_id)
            .orElseThrow();

        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setStart_date(eventDTO.getStartDate());
        event.setEnd_date(eventDTO.getEndDate());
        event.setType(eventDTO.getType());

        return eventRepository.save(event);
    }

    @Override
    public InstitutionalEvent createEvent(InstitutionalEventDTO eventDTO) {
        InstitutionalEvent event = InstitutionalEvent.builder()
            .title(eventDTO.getTitle())
            .description(eventDTO.getDescription())
            .start_date(eventDTO.getStartDate())
            .end_date(eventDTO.getEndDate())
            .type(eventDTO.getType())
            .build();

        return eventRepository.save(event);
    }

    @Override
    public void deleteEvent(Long event_id) {
        eventRepository.deleteById(event_id);
    }

    @Override
    public List<InstitutionalEvent> getAllEvents() {
        return eventRepository.findAll();
    }
}
