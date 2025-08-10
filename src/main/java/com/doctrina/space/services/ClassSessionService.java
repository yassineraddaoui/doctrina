package com.doctrina.space.services;

import com.doctrina.space.entity.*;
import com.doctrina.space.entity.enums.RoleType;
import com.doctrina.space.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ClassSessionService {
    private final ClassSessionRepository sessionRepo;
    private final RoomRepository roomRepo;
    private final AccountRepository accountRepo;

    // room availability check (overlap)
    public boolean isRoomAvailable(Room room, LocalDateTime startAt, int durationMinutes) {
        LocalDateTime end = startAt.plus(durationMinutes, ChronoUnit.MINUTES);
        List<ClassSession> sessions = sessionRepo.findByRoomId(room.getId());
        for (ClassSession s : sessions) {
            LocalDateTime sStart = s.getStartAt();
            LocalDateTime sEnd = sStart.plus(s.getDurationMinutes(), ChronoUnit.MINUTES);
            if (startAt.isBefore(sEnd) && sStart.isBefore(end)) {
                return false;
            }
        }
        return true;
    }

    @Transactional
    public ClassSession createSession(String title,
                                      LocalDateTime startAt,
                                      int durationMinutes,
                                      boolean online,
                                      Long teacherId,
                                      Set<Long> studentIds,
                                      Long roomId) {

        Account teacher = accountRepo.findById(teacherId).orElseThrow(() -> new RuntimeException("Teacher not found"));
        if (teacher.getRole() != RoleType.PROF) throw new RuntimeException("Account is not a teacher");

        ClassSession s = new ClassSession();
        s.setTitle(title);
        s.setStartAt(startAt);
        s.setDurationMinutes(durationMinutes);
        s.setOnline(online);
        s.setTeacher(teacher);

        if (!online) {
            if (roomId == null) throw new RuntimeException("Room required for in-classroom session");
            Room r = roomRepo.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));
            if (!isRoomAvailable(r, startAt, durationMinutes)) throw new RuntimeException("Room not available");
            s.setRoom(r);
        } else {
            s.setRoom(null);
        }

        if (studentIds != null) {
            for (Long sid : studentIds) {
                Account st = accountRepo.findById(sid).orElseThrow(() -> new RuntimeException("Student not found: " + sid));
                s.getStudents().add(st);
            }
        }

        return sessionRepo.save(s);
    }
}
