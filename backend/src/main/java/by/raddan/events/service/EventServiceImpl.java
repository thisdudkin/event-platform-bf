package by.raddan.events.service;

import by.raddan.events.dto.request.EventRequestDto;
import by.raddan.events.dto.request.TicketRequestDto;
import by.raddan.events.dto.response.EventResponseDto;
import by.raddan.events.dto.response.TicketRequestResponseDto;
import by.raddan.events.entity.Event;
import by.raddan.events.entity.TicketRequest;
import by.raddan.events.mapper.EventMapper;
import by.raddan.events.mapper.TicketRequestMapper;
import by.raddan.events.repository.EventRepository;
import by.raddan.events.repository.TicketRequestRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final TicketRequestRepository ticketRequestRepository;
    private final EventMapper eventMapper;
    private final TicketRequestMapper ticketRequestMapper;

    @Override
    @Transactional
    public EventResponseDto createEvent(EventRequestDto dto) {
        Event event = eventMapper.toEntity(dto);
        Event saved = eventRepository.save(event);
        return eventMapper.toDto(saved);
    }

    @Override
    @Transactional
    public EventResponseDto updateEvent(Long eventId, EventRequestDto dto) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id " + eventId));
        eventMapper.updateEntity(dto, event);
        Event updated = eventRepository.save(event);
        return eventMapper.toDto(updated);
    }

    @Override
    public EventResponseDto getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id " + eventId));
        return eventMapper.toDto(event);
    }

    @Override
    public Page<EventResponseDto> listEvents(Pageable pageable) {
        return eventRepository.findAll(pageable)
                .map(eventMapper::toDto);
    }

    @Override
    @Transactional
    public void deleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new EntityNotFoundException("Event not found with id " + eventId);
        }
        eventRepository.deleteById(eventId);
    }

    @Override
    @Transactional
    public TicketRequestResponseDto createRequest(Long eventId, TicketRequestDto dto) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id " + eventId));
        TicketRequest request = ticketRequestMapper.toEntity(dto, event);
        TicketRequest saved = ticketRequestRepository.save(request);
        return ticketRequestMapper.toDto(saved);
    }

    @Override
    public TicketRequestResponseDto getRequestById(Long requestId) {
        TicketRequest request = ticketRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Request not found with id " + requestId));
        return ticketRequestMapper.toDto(request);
    }

    @Override
    public Page<TicketRequestResponseDto> listRequest(Pageable pageable) {
        return ticketRequestRepository.findAll(pageable)
                .map(ticketRequestMapper::toDto);
    }

    @Override
    @Transactional
    public void deleteRequest(Long requestId) {
        if (!ticketRequestRepository.existsById(requestId)) {
            throw new EntityNotFoundException("Request not found with id " + requestId);
        }
        ticketRequestRepository.deleteById(requestId);
    }

    @Override
    @Transactional
    public void updateStatus(Long requestId, String status) {
        TicketRequest request = ticketRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Request not found with id " + requestId));
        request.setStatus(status);
        ticketRequestRepository.save(request);
    }

}
