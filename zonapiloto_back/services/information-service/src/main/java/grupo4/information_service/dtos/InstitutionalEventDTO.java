package grupo4.information_service.dtos;

import grupo4.information_service.enums.EventType;
import java.time.LocalDate;
import lombok.*;

@Data
public class InstitutionalEventDTO {

    private String title;
    private String description;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private EventType type;
}
