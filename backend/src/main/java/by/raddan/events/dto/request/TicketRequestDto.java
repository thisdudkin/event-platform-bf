package by.raddan.events.dto.request;

import jakarta.validation.constraints.*;

public record TicketRequestDto(
        @NotBlank(message = "Имя обязательно")
        String requesterName,
        @NotBlank(message = "Email обязателен")
        @Email(message = "Некорректный email")
        String requesterEmail,
        String requesterPhone,
        @NotNull(message = "Количество билетов обязательно")
        @Min(value = 1, message = "Минимум 1 билет")
        @Max(value = 5, message = "Максимум 5 билетов")
        Integer quantity,
        String message
) { }
