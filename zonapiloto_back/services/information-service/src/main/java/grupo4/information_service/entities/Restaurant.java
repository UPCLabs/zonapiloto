package grupo4.information_service.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "restaurants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long ownerUserId;

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(nullable = false)
    private String logo;

    @Column(nullable = false)
    private String location;

    @Column(nullable = true)
    private String menuUri;

    @Builder.Default
    private boolean state = true;
}
