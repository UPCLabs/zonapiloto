package grupo4.common_messaging.publisher;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class MessagePublisher {

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void send(String queueName, Object event) {
        try {
            String json = objectMapper.writeValueAsString(event);

            rabbitTemplate.convertAndSend(queueName, json);
        } catch (Exception e) {}
    }
}
