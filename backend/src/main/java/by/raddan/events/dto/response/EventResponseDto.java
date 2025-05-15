package by.raddan.events.dto.response;

import java.time.LocalDateTime;

public record EventResponseDto(
        Long eventId,
        String title,
        String description,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String venue,
        LocalDateTime createdAt
) { }
