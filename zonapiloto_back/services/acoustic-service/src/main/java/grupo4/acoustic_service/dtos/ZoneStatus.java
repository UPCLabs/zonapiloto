package grupo4.acoustic_service.dtos;

import grupo4.acoustic_service.enums.NoiseLevel;
import grupo4.acoustic_service.enums.StatusSource;

public record ZoneStatus(
    ZoneResponse zone,
    Double medianIndex,
    NoiseLevel level,
    long sampleCount,
    boolean enoughData,
    StatusSource source,
    /** Minutes since the latest live sample; null unless source is LIVE. */
    Long minutesAgo
) {}
