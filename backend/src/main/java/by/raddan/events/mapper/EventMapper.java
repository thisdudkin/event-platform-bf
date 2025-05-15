package by.raddan.events.mapper;

import by.raddan.events.dto.request.EventRequestDto;
import by.raddan.events.dto.response.EventResponseDto;
import by.raddan.events.entity.Event;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, imports = java.time.LocalDateTime.class, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", expression = "java(LocalDateTime.now())")
    Event toEntity(EventRequestDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(EventRequestDto dto, @MappingTarget Event entity);

    @Mapping(target = "eventId", source = "id")
    @Mapping(target = "createdAt", source = "createdAt")
    EventResponseDto toDto(Event event);

}
