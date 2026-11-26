package grupo4.acoustic_service.dtos;

import grupo4.acoustic_service.enums.TimeSlot;
import java.time.DayOfWeek;
import java.time.Instant;
import java.util.List;

public record Overview(
    TimeSlot slot,
    TimeSlot currentSlot,
    DayOfWeek day,
    /** True when the overview describes the current moment and may use live samples. */
    boolean live,
    int liveWindowMinutes,
    Instant generatedAt,
    int windowDays,
    int minSamples,
    List<ZoneStatus> zones,
    Recommendation study,
    Recommendation conversation
) {}
