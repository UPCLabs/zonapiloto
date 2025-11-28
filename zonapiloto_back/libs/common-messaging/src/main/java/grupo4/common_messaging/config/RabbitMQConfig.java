package grupo4.common_messaging.config;

import grupo4.common_messaging.publisher.MessagePublisher;
import grupo4.common_messaging.queues.QueuesNames;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
public class RabbitMQConfig {

    @Bean
    public Queue userEmail() {
        return new Queue(QueuesNames.EMAIL_QUEUE, true);
    }

    @Bean
    public MessagePublisher messagePublisher(RabbitTemplate template) {
        return new MessagePublisher(template);
    }
}
