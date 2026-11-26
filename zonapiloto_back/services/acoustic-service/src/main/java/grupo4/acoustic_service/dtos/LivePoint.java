package grupo4.acoustic_service.dtos;

import java.time.Instant;

public record LivePoint(Long zoneId, Instant capturedAt, double acousticIndex) {}
