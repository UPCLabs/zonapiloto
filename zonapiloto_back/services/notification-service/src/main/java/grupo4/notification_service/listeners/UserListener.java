package grupo4.notification_service.listeners;

import com.fasterxml.jackson.databind.ObjectMapper;
import grupo4.notification_service.entities.UserRegisterEvent;
import grupo4.notification_service.services.EmailService;
import java.util.logging.Logger;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserListener {

    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    private static final Logger LOGGER = Logger.getLogger("UserListeners");

    @RabbitListener(queues = "user.register")
    public void onUserRegister(String json) {
        try {
            UserRegisterEvent event = objectMapper.readValue(
                json,
                UserRegisterEvent.class
            );
            LOGGER.info("User register event received");

            emailService.sendEmail(event);
        } catch (Exception e) {}
    }
}
