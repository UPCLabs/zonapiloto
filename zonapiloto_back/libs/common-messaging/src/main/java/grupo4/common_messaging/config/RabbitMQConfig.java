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
    public Queue userRegisterQueue() {
        return new Queue(QueuesNames.USER_REGISTER, true);
    }

    @Bean
    public Queue userAcceptedQueue() {
        return new Queue(QueuesNames.USER_ACCEPTED, true);
    }

    @Bean
    public Queue userCreatedQueue() {
        return new Queue(QueuesNames.USER_CREATED, true);
    }

    @Bean
    public MessagePublisher messagePublisher(RabbitTemplate template) {
        return new MessagePublisher(template);
    }
}
