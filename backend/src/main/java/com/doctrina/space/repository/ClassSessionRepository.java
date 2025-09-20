package com.doctrina.space.repository;

import com.doctrina.space.entity.ClassSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassSessionRepository extends JpaRepository<ClassSession, Long> {
    List<ClassSession> findByRoomId(Long roomId);
}