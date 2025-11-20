package grupo4.information_service.entities;

import grupo4.information_service.enums.AdvertisementType;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.*;
import org.hibernate.annotations.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Where(clause = "active = true")
@Table(name = "advertisements")
public class Advertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDate date;

    @Builder.Default
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdvertisementType type;
}
