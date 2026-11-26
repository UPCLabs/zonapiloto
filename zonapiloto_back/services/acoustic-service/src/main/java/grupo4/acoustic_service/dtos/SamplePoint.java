package grupo4.acoustic_service.dtos;

import grupo4.acoustic_service.enums.TimeSlot;
import java.time.DayOfWeek;
import java.time.LocalDate;

public record SamplePoint(
    Long zoneId,
    LocalDate localDate,
    DayOfWeek dayOfWeek,
    TimeSlot timeSlot,
    double acousticIndex
) {}
