package by.raddan.events.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@Table(name = "ticket_requests")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TicketRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "requester_name", nullable = false, length = 150)
    private String requesterName;

    @Column(name = "requester_email", nullable = false, length = 255)
    private String requesterEmail;

    @Column(name = "requester_phone", length = 50)
    private String requesterPhone;

    @Builder.Default
    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Builder.Default
    @Column(name = "requested_at", nullable = false, updatable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "status", length = 255)
    private String status = "PENDING";

}
