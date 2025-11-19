package grupo4.information_service.entities;

import grupo4.information_service.enums.EventType;
import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "institutional_events")
@SQLDelete(sql = "UPDATE institutional_events SET active = false WHERE id = ?")
@Where(clause = "active = true")
public class InstitutionalEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate start_date;
    private LocalDate end_date;
    private String location;

    @Builder.Default
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    private EventType type;
}
