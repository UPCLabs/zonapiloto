package grupo4.acoustic_service.dtos;

import java.util.List;

public record ZoneHistory(
    ZoneResponse zone,
    int windowDays,
    List<SlotCell> matrix,
    List<DailyPoint> daily
) {}
