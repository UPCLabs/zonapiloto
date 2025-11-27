package grupo4.auth_service.controllers;

import grupo4.auth_service.events.UserRegisterEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class TestController {

    private final RabbitTemplate rabbitTemplate;

    @GetMapping("/test-event")
    public String fire() {
        UserRegisterEvent event = new UserRegisterEvent(
            "david-mendoza1@upc.edu.co",
            "Un usuario ha hecho un registro",
            "hola"
        );

        rabbitTemplate.convertAndSend("user.register", event);

        return "Evento enviado a RabbitMQ";
    }
}
