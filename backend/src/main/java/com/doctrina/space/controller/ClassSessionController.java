package com.doctrina.space.controller;

import com.doctrina.space.dto.ClassSessionDto;
import com.doctrina.space.entity.ClassSession;
import com.doctrina.space.services.ClassSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
public class ClassSessionController {

    @Autowired
    private ClassSessionService sessionService;

    // ✅ List all sessions
    @GetMapping
    public ResponseEntity<?> list() {
        return ResponseEntity.ok(sessionService.listAll());
    }

    // ✅ Create a new session
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ClassSessionDto dto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            // ✅ Extract email directly from JWT
            String authenticatedEmail = authentication.getName();

            if (dto.getStartAt() == null || dto.getStartAt().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "startAt is required"));
            }

            // Parse ISO date-time and convert to system default timezone
            ZonedDateTime zonedStart = ZonedDateTime.parse(dto.getStartAt());
            LocalDateTime start = zonedStart.withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();

            int duration = dto.getDurationMinutes() == null ? 60 : dto.getDurationMinutes();
            boolean online = dto.getOnline() == null || dto.getOnline();

            ClassSession session = sessionService.createSession(
                    dto.getTitle(),
                    start,
                    duration,
                    online,
                    authenticatedEmail, // ✅ teacher email
                    dto.getRoomId()
            );

            return ResponseEntity.ok(session);

        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format for startAt. Expected ISO format."));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // ✅ Join a session
    @PostMapping("/{sessionId}/join")
    public ResponseEntity<?> joinSession(@PathVariable Long sessionId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            // ✅ Extract email directly from JWT
            String authenticatedEmail = authentication.getName();

            // Call service to join the session
            sessionService.join(authenticatedEmail, sessionId);

            return ResponseEntity.ok(Map.of(
                    "message", "User successfully joined the session",
                    "sessionId", sessionId,
                    "userEmail", authenticatedEmail
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to join session: " + ex.getMessage()));
        }
    }
}
