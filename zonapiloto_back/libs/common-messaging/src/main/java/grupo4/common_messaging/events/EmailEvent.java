package grupo4.common_messaging.events;

import grupo4.common_messaging.email.EmailTemplate;
import java.util.Map;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmailEvent {

    private String to;
    private String subject;
    private EmailTemplate template;
    private Map<String, String> variables;
}
