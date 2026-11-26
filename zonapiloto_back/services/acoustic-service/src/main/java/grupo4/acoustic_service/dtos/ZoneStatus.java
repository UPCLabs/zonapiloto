package grupo4.acoustic_service.dtos;

import grupo4.acoustic_service.enums.NoiseLevel;

public record ZoneStatus(
    ZoneResponse zone,
    Double medianIndex,
    NoiseLevel level,
    long sampleCount,
    boolean enoughData
) {}
