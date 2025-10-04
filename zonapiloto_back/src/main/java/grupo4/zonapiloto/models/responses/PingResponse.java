package grupo4.zonapiloto.models.responses;

import java.time.LocalDateTime;

import grupo4.zonapiloto.models.enums.PingStatusCode;

public class PingResponse {
    private PingStatusCode status;
    private String version;
    private LocalDateTime timestamp;

    public PingResponse(PingStatusCode status, String version, LocalDateTime timestamp) {
        this.status = status;
        this.version = version;
        this.timestamp = timestamp;
    }

    public PingStatusCode getStatus() {
        return status;
    }

    public String getVersion() {
        return version;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
