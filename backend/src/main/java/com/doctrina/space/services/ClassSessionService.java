package com.doctrina.space.services;

import com.doctrina.space.entity.*;
import com.doctrina.space.entity.enums.RoleType;
import com.doctrina.space.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

@Service
public class ClassSessionService {
    @Autowired
    private  ClassSessionRepository sessionRepo;
    @Autowired
    private  RoomRepository roomRepo;
    @Autowired
    private
    AccountRepository accountRepo;

    // room availability check (overlap)
    public boolean isRoomAvailable(Room room, LocalDateTime startAt, int durationMinutes) {
        LocalDateTime end = startAt.plus(durationMinutes, ChronoUnit.MINUTES);
        List<ClassSession> sessions = sessionRepo.findByRoomId(room.getId());
        for (ClassSession s : sessions) {
            LocalDateTime sStart = s.getStartedAt();
            LocalDateTime sEnd = sStart.plus(s.getDurationMinutes(), ChronoUnit.MINUTES);
            if (startAt.isBefore(sEnd) && sStart.isBefore(end)) {
                return false;
            }
        }
        return true;
    }
    public List<ClassSession> listAll() {
        return sessionRepo.findAll();
    }

    @Transactional
    public ClassSession createSession(String title,
                                      LocalDateTime startAt,
                                      int durationMinutes,
                                      boolean online,
                                      String teacherEmail,
                                      Long roomId) {

        Account teacher = accountRepo.findByEmail(teacherEmail).orElseThrow(() -> new RuntimeException("Teacher not found"));
        if (teacher.getRole() != RoleType.TEACHER) throw new RuntimeException("Account is not a teacher");

        ClassSession s = new ClassSession();
        s.setTitle(title);
        s.setStartedAt(startAt);
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
        return sessionRepo.save(s);
    }

    @Transactional
    public void join(String authenticatedEmail, Long sessionId) {
        var student  = accountRepo.findByEmail(authenticatedEmail).orElseThrow(() -> new RuntimeException("Account not found"));
        if (student.getRole() != RoleType.STUDENT) throw new RuntimeException("Account is not a student");
        var session = sessionRepo.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        Set<Account> students = session.getStudents();
        if (students.contains(student)) throw new RuntimeException("Student already joined");
        students.add(student);
        session.setStudents(students);
        sessionRepo.save(session);
    }
}