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
    public boolean eventExists(Long eventId) {
        return eventRepository.existsById(eventId);
    }

    @Override
    public InstitutionalEvent getEvent(Long eventId) {
        return eventRepository.findByIdActive(eventId).orElse(null);
    }

    @Override
    public InstitutionalEvent updateEvent(
        Long eventId,
        InstitutionalEventDTO eventDTO
    ) {
        InstitutionalEvent event = eventRepository
            .findById(eventId)
            .orElseThrow();

        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setStart_date(eventDTO.getStartDate());
        event.setType(eventDTO.getType());
        event.setLocation(eventDTO.getLocation());
        event.setState(eventDTO.isState());

        return eventRepository.save(event);
    }

    @Override
    public InstitutionalEvent createEvent(InstitutionalEventDTO eventDTO) {
        InstitutionalEvent event = InstitutionalEvent.builder()
            .title(eventDTO.getTitle())
            .description(eventDTO.getDescription())
            .start_date(eventDTO.getStartDate())
            .type(eventDTO.getType())
            .location(eventDTO.getLocation())
            .url(eventDTO.getUrl())
            .build();

        return eventRepository.save(event);
    }

    @Override
    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    @Override
    public List<InstitutionalEvent> getAllEvents() {
        return eventRepository.findAllActive();
    }

    @Override
    public List<InstitutionalEvent> getAllAdminEvents() {
        return eventRepository.findAll();
    }

    @Override
    public InstitutionalEvent getEventAdmin(Long eventId) {
        return eventRepository.findById(eventId).orElse(null);
    }
}
