package grupo4.acoustic_service.dtos;

import grupo4.acoustic_service.enums.NoiseLevel;
import grupo4.acoustic_service.enums.TimeSlot;
import java.time.DayOfWeek;

public record SlotCell(
    DayOfWeek day,
    TimeSlot slot,
    Double medianIndex,
    long sampleCount,
    NoiseLevel level
) {}
