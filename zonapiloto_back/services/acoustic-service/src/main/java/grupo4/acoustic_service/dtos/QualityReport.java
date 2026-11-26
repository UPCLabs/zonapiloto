package grupo4.acoustic_service.dtos;

import grupo4.acoustic_service.enums.RejectionReason;
import java.util.List;
import java.util.Map;

public record QualityReport(
    int windowDays,
    long total,
    long accepted,
    long outliers,
    long rejected,
    double acceptanceRate,
    long distinctDevices,
    Map<RejectionReason, Long> rejectedByReason,
    List<ZoneQuality> zones
) {}
