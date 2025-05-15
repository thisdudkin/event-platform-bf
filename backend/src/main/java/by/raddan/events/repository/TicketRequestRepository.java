package by.raddan.events.repository;

import by.raddan.events.entity.TicketRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRequestRepository extends JpaRepository<TicketRequest, Long> { }
