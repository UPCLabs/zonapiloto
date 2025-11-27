package grupo4.auth_service.events;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterEvent {

    private String emailTo;
    private String subject;
    private String body;
}
