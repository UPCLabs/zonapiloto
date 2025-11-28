package grupo4.common_messaging.util;

import tools.jackson.databind.ObjectMapper;

public class EventMapper {

    private static final ObjectMapper mapper = new ObjectMapper();

    public static <T> T fromJson(String json, Class<T> clazz) {
        try {
            return mapper.readValue(json, clazz);
        } catch (Exception e) {
            throw new RuntimeException(
                "Error mapping JSON to " + clazz.getSimpleName(),
                e
            );
        }
    }

    public static String toJson(Object obj) {
        try {
            return mapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException("Error converting object to JSON", e);
        }
    }
}
