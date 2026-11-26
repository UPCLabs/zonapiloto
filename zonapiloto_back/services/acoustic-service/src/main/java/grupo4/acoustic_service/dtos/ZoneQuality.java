package grupo4.acoustic_service.dtos;

public record ZoneQuality(
    ZoneResponse zone,
    long accepted,
    long outliers,
    long rejected
) {}
