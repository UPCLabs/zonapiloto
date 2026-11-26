package grupo4.acoustic_service.init;

import grupo4.acoustic_service.entities.Zone;
import grupo4.acoustic_service.repositories.ZoneRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds the five pilot zones on an empty database. Positions are percentages
 * of the official campus map image (src/assets/images/sonoro/campus-map.webp),
 * placed on each building's letter badge.
 */
@Component
@RequiredArgsConstructor
public class PilotZonesInit implements CommandLineRunner {

    private final ZoneRepository zoneRepository;

    private record Seed(String code, String name, String description, double x, double y) {}

    private static final List<Seed> PILOT_ZONES = List.of(
        new Seed("A", "Sede A", "Biblioteca", 39.6, 24.7),
        new Seed(
            "F",
            "Sede F",
            "Facultad de Arquitectura y Artes, zona de cafetería y laboratorios",
            63.1,
            8.0
        ),
        new Seed(
            "D",
            "Sede D",
            "Laboratorio de Informática, salas de cómputo y Mediexpress",
            80.7,
            37.7
        ),
        new Seed(
            "G",
            "Sede G",
            "Salas de cómputo, Dirección de Tecnología y sala múltiple",
            61.8,
            61.3
        ),
        new Seed(
            "APR",
            "Sede APR",
            "Auditorios, plazoleta de comidas, salones y salas de cómputo",
            33.6,
            73.0
        )
    );

    @Override
    public void run(String... args) {
        if (zoneRepository.count() > 0) {
            return;
        }
        for (Seed seed : PILOT_ZONES) {
            Zone zone = new Zone();
            zone.setCode(seed.code());
            zone.setName(seed.name());
            zone.setDescription(seed.description());
            zone.setMapX(seed.x());
            zone.setMapY(seed.y());
            zoneRepository.save(zone);
        }
    }
}
