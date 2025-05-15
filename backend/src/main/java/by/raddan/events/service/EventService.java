package by.raddan.events.service;

import by.raddan.events.dto.request.EventRequestDto;
import by.raddan.events.dto.request.TicketRequestDto;
import by.raddan.events.dto.response.EventResponseDto;
import by.raddan.events.dto.response.TicketRequestResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EventService {

    EventResponseDto createEvent(EventRequestDto dto);
    EventResponseDto updateEvent(Long eventId, EventRequestDto dto);
    EventResponseDto getEventById(Long eventId);
    Page<EventResponseDto> listEvents(Pageable pageable);
    void deleteEvent(Long eventId);

    TicketRequestResponseDto createRequest(Long eventId, TicketRequestDto dto);
    TicketRequestResponseDto getRequestById(Long requestId);
    Page<TicketRequestResponseDto> listRequest(Pageable pageable);
    void deleteRequest(Long requestId);
    void updateStatus(Long requestId, String status);

}
