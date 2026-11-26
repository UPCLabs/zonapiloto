package grupo4.acoustic_service.config;

import java.time.Clock;
import java.time.ZoneId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClockConfig {

    @Bean
    public Clock campusClock(@Value("${acoustic.timezone}") String timezone) {
        return Clock.system(ZoneId.of(timezone));
    }
}
