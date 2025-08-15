package com.doctrina.space.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int capacity;

    @OneToMany(mappedBy = "room")
    private Set<ClassSession> sessions = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public Set<ClassSession> getSessions() {
        return sessions;
    }

    public void setSessions(Set<ClassSession> sessions) {
        this.sessions = sessions;
    }

    public Room(Long id, String name, int capacity, Set<ClassSession> sessions) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.sessions = sessions;
    }
    public Room() {}
}