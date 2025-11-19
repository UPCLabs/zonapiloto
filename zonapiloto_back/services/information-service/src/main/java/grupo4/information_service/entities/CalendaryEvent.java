package grupo4.information_service.entities;

import grupo4.information_service.enums.EventType;
import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "calendary_events")
public class CalendaryEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate start_date;
    private LocalDate end_date;

    @Enumerated(EnumType.STRING)
    private EventType type;
}
