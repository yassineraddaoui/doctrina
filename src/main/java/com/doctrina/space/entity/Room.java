package com.doctrina.space.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "rooms")
public class Room {

    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int capacity;

    @OneToMany(mappedBy = "room")
    private Set<ClassSession> sessions = new HashSet<>();

    public Room() {}

    public Room(String name, int capacity) {
        this.name = name;
        this.capacity = capacity;
    }

    // Getters & Setters


}
