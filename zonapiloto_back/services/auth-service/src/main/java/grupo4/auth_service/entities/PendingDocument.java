package grupo4.auth_service.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "pending_documents")
public class PendingDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long pendingUserId;

    @Column(nullable = false)
    private String documentUri;

    @Column(nullable = false)
    private String documentName;
}
