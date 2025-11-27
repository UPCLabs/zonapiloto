package grupo4.notification_service.services;

import grupo4.notification_service.entities.UserRegisterEvent;
import java.util.logging.Logger;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${spring.mail.username}")
    private String hostMail;

    private final JavaMailSender mailSender;
    private static final Logger LOGGER = Logger.getLogger(
        EmailService.class.toString()
    );

    @Async
    public void sendEmail(UserRegisterEvent request) {
        String email = String.format("Zonapiloto <%s>", hostMail);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(email);
            message.setTo(request.getEmailTo());
            message.setSubject(request.getSubject());
            message.setText(request.getBody());

            mailSender.send(message);
        } catch (MailException e) {
            LOGGER.severe("Sending email failed: " + e.getMessage());
        }
    }

    @Async
    public void sendEmailAttachment() {}
}
