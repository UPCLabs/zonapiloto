package grupo4.acoustic_service.dtos;

import java.time.LocalDate;

public record DailyPoint(LocalDate date, Double medianIndex, long sampleCount) {}
