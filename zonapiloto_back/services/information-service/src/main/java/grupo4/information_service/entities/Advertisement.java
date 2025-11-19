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
@SQLDelete(sql = "UPDATE advertisements SET active = false WHERE id = ?")
@Where(clause = "active = true")
@Table(name = "advertisements")
public class Advertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    private LocalDate date;

    @Builder.Default
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    private AdvertisementType type;
}
