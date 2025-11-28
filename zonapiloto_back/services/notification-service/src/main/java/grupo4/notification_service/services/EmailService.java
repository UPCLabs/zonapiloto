package grupo4.notification_service.services;

import grupo4.common_messaging.events.EmailEvent;
import jakarta.mail.internet.MimeMessage;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${spring.mail.username}")
    private String hostMail;

    private final JavaMailSender mailSender;

    @Async
    public void sendEmail(EmailEvent request) {
        try {
            String html = loadTemplate(request.getTemplate().toString());

            for (var entry : request.getVariables().entrySet()) {
                html = html.replace(
                    "{{" + entry.getKey() + "}}",
                    entry.getValue()
                );
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                message,
                true,
                "UTF-8"
            );

            helper.setFrom("ZonaPiloto <" + hostMail + ">");
            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());
            helper.setText(html, true);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String loadTemplate(String name) throws Exception {
        ClassPathResource resource = new ClassPathResource(
            "templates/email/" + name + ".html"
        );
        try (InputStream inputStream = resource.getInputStream()) {
            return new String(
                inputStream.readAllBytes(),
                StandardCharsets.UTF_8
            );
        }
    }
}
