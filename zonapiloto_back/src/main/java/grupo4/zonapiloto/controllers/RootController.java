package grupo4.zonapiloto.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Void> redirectPing() {
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .header("location", "api/status/ping")
                .build();
    }
}
