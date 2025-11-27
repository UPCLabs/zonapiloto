package grupo4.notification_service.entities;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterEvent {

    private String emailTo;
    private String subject;
    private String body;
}
