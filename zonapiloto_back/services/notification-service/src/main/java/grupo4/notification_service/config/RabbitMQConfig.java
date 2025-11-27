package grupo4.notification_service.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String USER_REGISTER = "user.register";
    public static final String USER_ACCEPTED = "user.accepted";
    public static final String USER_CREATED = "user.created";

    @Bean
    public Queue userRegisterQueue() {
        return new Queue(USER_REGISTER, true);
    }

    @Bean
    public Queue userAcceptedQueue() {
        return new Queue(USER_ACCEPTED, true);
    }

    @Bean
    public Queue userCreatedQueue() {
        return new Queue(USER_CREATED, true);
    }
}
