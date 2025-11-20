package grupo4.information_service.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import grupo4.information_service.enums.EventType;
import java.time.LocalDate;
import lombok.*;

@Data
public class InstitutionalEventDTO {

    private String title;
    private String description;
    private String location;

    @JsonProperty("start_date")
    private LocalDate startDate;

    @JsonProperty("end_date")
    private LocalDate endDate;

    private EventType type;
    private boolean active;
    private String url;
}
