package grupo4.common_messaging.events;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterEvent {

    private String emailTo;
    private String subject;
    private String body;
}
