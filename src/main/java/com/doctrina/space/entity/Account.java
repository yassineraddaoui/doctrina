package com.doctrina.space.entity;

import com.doctrina.space.dto.InvitationRequest;
import jakarta.persistence.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import com.doctrina.space.entity.enums.RoleType;

@Entity
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleType role;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ClassSession> teachingSessions = new HashSet<>();

    @ManyToMany(mappedBy = "students", cascade = CascadeType.ALL)
    private Set<ClassSession> attendingSessions = new HashSet<>();

    @Column(name = "invitation_token")
    private String invitationToken;

    @Column(name = "invitation_at")
    private Date invitationAt;

    // No-argument constructor
    public Account() {
    }

    // Constructor for invitation generation
    public Account(InvitationRequest req, String token) {
        this.email = req.getEmail();
        this.role = req.getRole() != null ? req.getRole() : RoleType.TEACHER; // Default to TEACHER if null
        this.invitationToken = token;
        this.invitationAt = new Date();
        // fullName and password are not set here; they should be provided during registration
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }

    public Set<ClassSession> getTeachingSessions() {
        return teachingSessions;
    }

    public void setTeachingSessions(Set<ClassSession> teachingSessions) {
        this.teachingSessions = teachingSessions;
    }

    public Set<ClassSession> getAttendingSessions() {
        return attendingSessions;
    }

    public void setAttendingSessions(Set<ClassSession> attendingSessions) {
        this.attendingSessions = attendingSessions;
    }

    public String getInvitationToken() {
        return invitationToken;
    }

    public void setInvitationToken(String invitationToken) {
        this.invitationToken = invitationToken;
    }

    public Date getInvitationAt() {
        return invitationAt;
    }

    public void setInvitationAt(Date invitationAt) {
        this.invitationAt = invitationAt;
    }
}