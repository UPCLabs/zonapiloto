package grupo4.information_service.entities;

import grupo4.information_service.enums.AdvertisementType;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
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
    private boolean state = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdvertisementType type;
}
