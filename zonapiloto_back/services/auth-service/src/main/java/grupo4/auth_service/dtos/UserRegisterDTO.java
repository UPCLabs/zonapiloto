package grupo4.auth_service.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisterDTO {

    private String username;
    private String email;

    private String role;
}
