package grupo4.auth_service.dtos;

import grupo4.auth_service.entities.PendingDocument;
import java.util.List;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingUserDTO {

    private Long id;
    private String username;
    private String email;
    private String role;
    private List<PendingDocument> documents;
}
