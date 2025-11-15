package grupo4.profile_service.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permission")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "entity_name")
    private String entityName;

    @Column(name = "action")
    private String action;

    @Column(name = "granted")
    private Boolean granted;
}
