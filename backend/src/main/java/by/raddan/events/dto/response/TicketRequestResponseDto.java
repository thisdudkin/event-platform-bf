package by.raddan.events.dto.response;

import java.time.LocalDateTime;

public record TicketRequestResponseDto(
        Long requestId,
        Long eventId,
        String requesterName,
        String requesterEmail,
        String requesterPhone,
        Integer quantity,
        String message,
        LocalDateTime requestedAt
) { }
