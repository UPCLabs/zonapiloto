package grupo4.acoustic_service.dtos;

import java.util.List;

public record ZoneTrend(ZoneResponse zone, List<DailyPoint> daily) {}
