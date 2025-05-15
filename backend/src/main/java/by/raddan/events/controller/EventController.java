package by.raddan.events.controller;

import by.raddan.events.dto.request.EventRequestDto;
import by.raddan.events.dto.request.TicketRequestDto;
import by.raddan.events.dto.response.EventResponseDto;
import by.raddan.events.dto.response.TicketRequestResponseDto;
import by.raddan.events.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping("/events")
    public ResponseEntity<Page<EventResponseDto>> getAllEvents(Pageable pageable) {
        Page<EventResponseDto> page = eventService.listEvents(pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<EventResponseDto> getEventById(@PathVariable("id") Long eventId) {
        EventResponseDto dto = eventService.getEventById(eventId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/events")
    public ResponseEntity<EventResponseDto> createEvent(
            @Valid @RequestBody EventRequestDto requestDto) {
        EventResponseDto created = eventService.createEvent(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<EventResponseDto> updateEvent(
            @PathVariable("id") Long eventId,
            @Valid @RequestBody EventRequestDto requestDto) {
        EventResponseDto updated = eventService.updateEvent(eventId, requestDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable("id") Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/events/{id}/requests")
    public ResponseEntity<TicketRequestResponseDto> createTicketRequest(
            @PathVariable("id") Long eventId,
            @Valid @RequestBody TicketRequestDto requestDto) {
        TicketRequestResponseDto responseDto = eventService.createRequest(eventId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/events/requests")
    public ResponseEntity<Page<TicketRequestResponseDto>> getAllRequests(Pageable pageable) {
        Page<TicketRequestResponseDto> page = eventService.listRequest(pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/events/requests/{id}")
    public ResponseEntity<TicketRequestResponseDto> getRequestById(@PathVariable("id") Long requestId) {
        TicketRequestResponseDto dto = eventService.getRequestById(requestId);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/events/requests/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable("id") Long requestId) {
        eventService.deleteRequest(requestId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/events/requests/{id}/update-status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable("id") Long requestId,
            @RequestParam("status") String status) {
        eventService.updateStatus(requestId, status);
        return ResponseEntity.noContent().build();
    }

}
