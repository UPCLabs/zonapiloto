package grupo4.notification_service.listeners;

import grupo4.common_messaging.events.EmailEvent;
import grupo4.common_messaging.util.EventMapper;
import grupo4.notification_service.services.EmailService;
import java.util.logging.Logger;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserListener {

    private final EmailService emailService;

    private static final Logger LOGGER = Logger.getLogger("UserListeners");

    @RabbitListener(queues = "user.email")
    public void onUserRegister(String json) {
        LOGGER.info("User register event received");

        try {
            EmailEvent event = EventMapper.fromJson(json, EmailEvent.class);

            emailService.sendEmail(event);
        } catch (Exception e) {
            LOGGER.severe("Error parsing JSON: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
