package com.doctrina.space.controller;

import com.doctrina.space.dto.ClassSessionDto;
import com.doctrina.space.entity.ClassSession;
import com.doctrina.space.services.ClassSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map; // ✅ FIXED import
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class ClassSessionController {
    private final ClassSessionService sessionService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ClassSessionDto dto) {
        try {
            LocalDateTime start = LocalDateTime.parse(dto.getStartAt());
            int dur = dto.getDurationMinutes() == null ? 60 : dto.getDurationMinutes();
            boolean online = dto.getOnline() == null ? true : dto.getOnline();
            Set<Long> students = dto.getStudentIds() == null ? null : dto.getStudentIds()
                    .stream()
                    .collect(Collectors.toSet());
            ClassSession s = sessionService.createSession(
                    dto.getTitle(),
                    start,
                    dur,
                    online,
                    dto.getTeacherId(),
                    students,
                    dto.getRoomId()
            );
            return ResponseEntity.ok(s);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
