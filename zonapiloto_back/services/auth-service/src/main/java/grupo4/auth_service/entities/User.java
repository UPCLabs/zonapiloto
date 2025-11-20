package grupo4.auth_service.entities;

import grupo4.auth_service.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    @Column(nullable = true)
    private String mfaSecret;

    @Column(nullable = false)
    private String password;

    private boolean mfaPending;

    @Enumerated(EnumType.STRING)
    private UserRole role;
}
