package by.raddan.events.repository;

import by.raddan.events.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> { }
