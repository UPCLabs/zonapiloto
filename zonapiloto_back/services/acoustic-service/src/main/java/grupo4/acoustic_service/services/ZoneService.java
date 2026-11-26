package grupo4.acoustic_service.services;

import grupo4.acoustic_service.dtos.ZoneRequest;
import grupo4.acoustic_service.dtos.ZoneResponse;
import grupo4.acoustic_service.entities.Zone;
import grupo4.acoustic_service.repositories.ZoneRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ZoneService {

    private final ZoneRepository zoneRepository;

    @Transactional(readOnly = true)
    public List<ZoneResponse> activeZones() {
        return zoneRepository
            .findByActiveTrueOrderByCodeAsc()
            .stream()
            .map(ZoneResponse::of)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ZoneResponse> allZones() {
        return zoneRepository
            .findAllByOrderByCodeAsc()
            .stream()
            .map(ZoneResponse::of)
            .toList();
    }

    /** Joins the caller's transaction so the returned entity stays managed. */
    @Transactional
    public Zone require(Long id) {
        return zoneRepository
            .findById(id)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Zona no encontrada"
                )
            );
    }

    @Transactional
    public ZoneResponse create(ZoneRequest request) {
        String code = request.code().trim().toUpperCase();
        if (zoneRepository.existsByCodeIgnoreCase(code)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Ya existe una zona con ese código"
            );
        }
        Zone zone = new Zone();
        apply(zone, request, code);
        return ZoneResponse.of(zoneRepository.save(zone));
    }

    @Transactional
    public ZoneResponse update(Long id, ZoneRequest request) {
        Zone zone = require(id);
        String code = request.code().trim().toUpperCase();
        if (zoneRepository.existsByCodeIgnoreCaseAndIdNot(code, id)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Ya existe una zona con ese código"
            );
        }
        apply(zone, request, code);
        return ZoneResponse.of(zone);
    }

    private void apply(Zone zone, ZoneRequest request, String code) {
        zone.setCode(code);
        zone.setName(request.name().trim());
        zone.setDescription(
            request.description() == null ? null : request.description().trim()
        );
        zone.setMapX(request.mapX());
        zone.setMapY(request.mapY());
        if (request.active() != null) {
            zone.setActive(request.active());
        }
    }
}
