package grupo4.information_service.entities;

import grupo4.information_service.enums.AdvertisementType;
import jakarta.persistence.*;
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

    private String description;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private AdvertisementType type;
}
