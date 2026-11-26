package grupo4.acoustic_service.dtos;

import grupo4.acoustic_service.enums.TimeSlot;
import java.util.List;

public record Overview(
    TimeSlot slot,
    TimeSlot currentSlot,
    int windowDays,
    int minSamples,
    List<ZoneStatus> zones,
    Recommendation study,
    Recommendation conversation
) {}
