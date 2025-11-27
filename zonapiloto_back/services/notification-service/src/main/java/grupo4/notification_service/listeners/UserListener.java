package grupo4.notification_service.listeners;

import grupo4.notification_service.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserListener {

    private final EmailService emailService;

    @RabbitListener(queues = "user.register")
    public void onUserRegister(String message) {
        System.out.println("📥 Evento recibido: user.register");
        System.out.println("Contenido: " + message);

        emailService.sendEmail(
            "santiagoyasno@gmail.com",
            "prueba",
            "holaaaaaaaaa"
        );
    }
}
