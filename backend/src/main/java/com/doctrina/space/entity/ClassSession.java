package com.doctrina.space.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
public class ClassSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private LocalDateTime startedAt;
    private int durationMinutes;
    private boolean online;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Account teacher;

    @ManyToMany
    @JoinTable(
            name = "class_session_students",
            joinColumns = @JoinColumn(name = "class_session_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<Account> students = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Account getTeacher() {
        return teacher;
    }

    public void setTeacher(Account teacher) {
        this.teacher = teacher;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public Set<Account> getStudents() {
        return students;
    }

    public void setStudents(Set<Account> students) {
        this.students = students;
    }
}