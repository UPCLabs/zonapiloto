package grupo4.information_service.services;

import grupo4.information_service.dtos.CalendaryEventDTO;
import grupo4.information_service.entities.CalendaryEvent;
import grupo4.information_service.interfaces.IEventService;
import grupo4.information_service.repositories.IEventRepo;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EventService implements IEventService {

    private final IEventRepo eventRepository;

    @Override
    public boolean eventExists(Long eventId) {
        return eventRepository.existsById(eventId);
    }

    @Override
    public CalendaryEvent getEvent(Long eventId) {
        return eventRepository.findByIdActive(eventId).orElse(null);
    }

    @Override
    public CalendaryEvent updateEvent(
        Long eventId,
        CalendaryEventDTO eventDTO
    ) {
        CalendaryEvent event = eventRepository.findById(eventId).orElseThrow();

        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setStart_date(eventDTO.getStartDate());
        event.setEnd_date(eventDTO.getEndDate());
        event.setType(eventDTO.getType());
        event.setState(eventDTO.isState());

        return eventRepository.save(event);
    }

    @Override
    public CalendaryEvent createEvent(CalendaryEventDTO eventDTO) {
        CalendaryEvent event = CalendaryEvent.builder()
            .title(eventDTO.getTitle())
            .description(eventDTO.getDescription())
            .start_date(eventDTO.getStartDate())
            .end_date(eventDTO.getEndDate())
            .type(eventDTO.getType())
            .build();

        return eventRepository.save(event);
    }

    @Override
    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    @Override
    public List<CalendaryEvent> getAllEvents() {
        return eventRepository.findAllActive();
    }

    @Override
    public List<CalendaryEvent> getAllAdminEvents() {
        return eventRepository.findAll();
    }

    @Override
    public CalendaryEvent getEventAdmin(Long eventId) {
        return eventRepository.findById(eventId).orElse(null);
    }
}
