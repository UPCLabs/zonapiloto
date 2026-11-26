package grupo4.acoustic_service.controllers;

import grupo4.acoustic_service.dtos.QualityReport;
import grupo4.acoustic_service.dtos.ZoneRequest;
import grupo4.acoustic_service.dtos.ZoneResponse;
import grupo4.acoustic_service.dtos.ZoneTrend;
import grupo4.acoustic_service.services.InsightsService;
import grupo4.acoustic_service.services.ZoneService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Increment 4 administration: zones, trends, and sample quality. */
@RestController
@RequestMapping("/acoustic/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
public class AcousticAdminController {

    private final ZoneService zoneService;
    private final InsightsService insightsService;

    @GetMapping("/zones")
    public List<ZoneResponse> zones() {
        return zoneService.allZones();
    }

    @PostMapping("/zones")
    @ResponseStatus(HttpStatus.CREATED)
    public ZoneResponse create(@Valid @RequestBody ZoneRequest request) {
        return zoneService.create(request);
    }

    @PutMapping("/zones/{id}")
    public ZoneResponse update(
        @PathVariable Long id,
        @Valid @RequestBody ZoneRequest request
    ) {
        return zoneService.update(id, request);
    }

    @GetMapping("/trends")
    public List<ZoneTrend> trends(@RequestParam(defaultValue = "14") int days) {
        return insightsService.trends(days);
    }

    @GetMapping("/quality")
    public QualityReport quality(@RequestParam(defaultValue = "30") int days) {
        return insightsService.quality(days);
    }
}
