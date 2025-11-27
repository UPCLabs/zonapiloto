package grupo4.auth_service.controllers;

import grupo4.common_messaging.events.UserRegisterEvent;
import grupo4.common_messaging.publisher.MessagePublisher;
import grupo4.common_messaging.queues.QueuesNames;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class TestController {

    private final MessagePublisher publisher;

    @GetMapping("/test-event")
    public String fire() {
        UserRegisterEvent event = new UserRegisterEvent(
            "david-mendoza1@upc.edu.co",
            "Un usuario ha hecho un registro",
            "hola"
        );

        publisher.send(QueuesNames.USER_REGISTER, event);

        return "Evento enviado a RabbitMQ";
    }
}
