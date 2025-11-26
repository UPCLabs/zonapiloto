package grupo4.information_service.entities;

import grupo4.information_service.enums.EventType;
import jakarta.persistence.*;
import jakarta.persistence.Table;
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

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDate start_date;

    @Column(nullable = false)
    private LocalDate end_date;

    @Builder.Default
    private boolean state = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType type;
}
