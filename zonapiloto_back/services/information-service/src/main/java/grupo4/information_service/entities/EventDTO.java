package grupo4.information_service.entities;

import grupo4.information_service.enums.EventType;
import java.time.LocalDate;
import lombok.*;

@Data
public class EventDTO {

    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private EventType type;
}
