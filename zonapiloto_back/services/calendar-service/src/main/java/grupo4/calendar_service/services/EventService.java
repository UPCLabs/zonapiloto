package grupo4.calendar_service.services;

import grupo4.calendar_service.entities.Event;
import grupo4.calendar_service.entities.EventDTO;
import grupo4.calendar_service.interfaces.IEventService;
import grupo4.calendar_service.repositories.EventRepository;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EventService implements IEventService {

    private final EventRepository eventRepository;

    @Override
    public boolean eventExists(Long event_id) {
        return eventRepository.existsById(event_id);
    }

    @Override
    public Event getEvent(Long event_id) {
        return eventRepository.findById(event_id).orElse(null);
    }

    @Override
    public Event updateEvent(Long event_id, EventDTO eventDTO) {
        Event event = eventRepository.findById(event_id).orElseThrow();

        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setStart_date(eventDTO.getStartDate());
        event.setEnd_date(eventDTO.getEndDate());
        event.setType(eventDTO.getType());

        return eventRepository.save(event);
    }

    @Override
    public Event createEvent(EventDTO eventDTO) {
        Event event = Event.builder()
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
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
}
