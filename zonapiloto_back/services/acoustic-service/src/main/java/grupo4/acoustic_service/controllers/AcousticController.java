package grupo4.acoustic_service.controllers;

import grupo4.acoustic_service.dtos.Overview;
import grupo4.acoustic_service.dtos.SampleRequest;
import grupo4.acoustic_service.dtos.SampleResponse;
import grupo4.acoustic_service.dtos.ZoneHistory;
import grupo4.acoustic_service.dtos.ZoneResponse;
import grupo4.acoustic_service.enums.TimeSlot;
import grupo4.acoustic_service.services.InsightsService;
import grupo4.acoustic_service.services.SampleService;
import grupo4.acoustic_service.services.ZoneService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Public endpoints: anonymous capture and aggregated results. */
@RestController
@RequestMapping("/acoustic")
@RequiredArgsConstructor
public class AcousticController {

    private final ZoneService zoneService;
    private final SampleService sampleService;
    private final InsightsService insightsService;

    @GetMapping("/zones")
    public List<ZoneResponse> zones() {
        return zoneService.activeZones();
    }

    @PostMapping("/samples")
    @ResponseStatus(HttpStatus.CREATED)
    public SampleResponse submit(@Valid @RequestBody SampleRequest request) {
        return sampleService.register(request);
    }

    @GetMapping("/overview")
    public Overview overview(@RequestParam(required = false) TimeSlot slot) {
        return insightsService.overview(slot);
    }

    @GetMapping("/zones/{id}/history")
    public ZoneHistory history(
        @PathVariable Long id,
        @RequestParam(defaultValue = "30") int days
    ) {
        return insightsService.history(id, days);
    }
}
