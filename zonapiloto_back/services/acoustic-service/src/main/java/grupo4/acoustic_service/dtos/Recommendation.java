package grupo4.acoustic_service.dtos;

import grupo4.acoustic_service.enums.Activity;
import java.util.List;

/** Zones suited to an activity, best first. Only zones with enough data are ranked. */
public record Recommendation(Activity activity, List<ZoneStatus> ranked) {}
