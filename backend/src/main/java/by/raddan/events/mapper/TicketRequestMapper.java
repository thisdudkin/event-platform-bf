package by.raddan.events.mapper;

import by.raddan.events.dto.request.TicketRequestDto;
import by.raddan.events.dto.response.TicketRequestResponseDto;
import by.raddan.events.entity.Event;
import by.raddan.events.entity.TicketRequest;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, imports = java.time.LocalDateTime.class, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketRequestMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "event", source = "event")
    @Mapping(target = "requestedAt", expression = "java(LocalDateTime.now())")
    TicketRequest toEntity(TicketRequestDto dto, Event event);

    @Mapping(target = "requestId", source = "id")
    @Mapping(target = "eventId", source = "event.id")
    TicketRequestResponseDto toDto(TicketRequest tr);

}
