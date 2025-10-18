package grupo4.zonapiloto.controllers;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import grupo4.zonapiloto.models.enums.PingStatusCode;
import grupo4.zonapiloto.models.responses.PingResponse;

@RestController
@RequestMapping("api/status")
public class PingController {
    @Value("${app.version}")
    private String zonapiloto_version;

    @GetMapping("/ping")
    public ResponseEntity<PingResponse> ping() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new PingResponse(PingStatusCode.OK, zonapiloto_version, LocalDateTime.now()));
    }
}
