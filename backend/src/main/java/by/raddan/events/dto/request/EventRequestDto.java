package by.raddan.events.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record EventRequestDto(
        @NotBlank(message = "Заголовок не может быть пустым")
        String title,
        String description,
        @NotNull(message = "Дата и время начала обязательны")
        LocalDateTime startTime,
        @NotNull(message = "Дата и время окончания обязательны")
        LocalDateTime endTime,
        String venue
) { }
