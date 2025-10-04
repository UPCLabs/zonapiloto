package grupo4.zonapiloto.utils;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class LoggerService {
    private final Logger logger = LoggerFactory.getLogger(LoggerService.class);

    public void info(String msg) {
        logger.info(msg);
    }

    public void debug(String msg) {
        logger.debug(msg);
    }

    public void warn(String msg) {
        logger.warn(msg);
    }

    public void error(String msg) {
        logger.error(msg);
    }

    public void error(String msg, Throwable ex) {
        logger.error(msg, ex);
    }
}
