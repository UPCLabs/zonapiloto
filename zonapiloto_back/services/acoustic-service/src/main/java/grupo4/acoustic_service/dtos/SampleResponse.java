package grupo4.acoustic_service.dtos;

import grupo4.acoustic_service.enums.NoiseLevel;
import grupo4.acoustic_service.enums.RejectionReason;
import grupo4.acoustic_service.enums.SampleStatus;
import grupo4.acoustic_service.enums.TimeSlot;

public record SampleResponse(
    Long id,
    String zoneName,
    SampleStatus status,
    RejectionReason rejectionReason,
    double acousticIndex,
    NoiseLevel level,
    TimeSlot timeSlot
) {}
