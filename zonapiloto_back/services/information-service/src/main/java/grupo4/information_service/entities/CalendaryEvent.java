package grupo4.information_service.entities;

import grupo4.information_service.enums.EventType;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.*;
import org.hibernate.annotations.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "calendary_events")
@SQLDelete(sql = "UPDATE calendary_events SET active = false WHERE id = ?")
@Where(clause = "active = true")
public class CalendaryEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate start_date;
    private LocalDate end_date;

    @Builder.Default
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    private EventType type;
}
