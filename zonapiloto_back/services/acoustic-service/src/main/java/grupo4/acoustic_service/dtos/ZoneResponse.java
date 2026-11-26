package grupo4.acoustic_service.dtos;

import grupo4.acoustic_service.entities.Zone;

public record ZoneResponse(
    Long id,
    String code,
    String name,
    String description,
    double mapX,
    double mapY,
    boolean active
) {
    public static ZoneResponse of(Zone zone) {
        return new ZoneResponse(
            zone.getId(),
            zone.getCode(),
            zone.getName(),
            zone.getDescription(),
            zone.getMapX(),
            zone.getMapY(),
            zone.isActive()
        );
    }
}
