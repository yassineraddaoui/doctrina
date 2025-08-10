package com.doctrina.space.entity;

import com.doctrina.space.dto.InvitationRequest;
import jakarta.persistence.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import com.doctrina.space.entity.enums.RoleType;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private RoleType role;

    @OneToMany(mappedBy = "teacher")
     private Set<ClassSession> teachingSessions = new HashSet<>();

    @ManyToMany(mappedBy = "students")
     private Set<ClassSession> attendingSessions = new HashSet<>();
    private String invitationToken;
    private Date invitationAt;

    public Account(InvitationRequest req,String token) {
        email = req.getEmail();
        role = req.getRole();
        invitationToken=token;
        invitationAt=new Date();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

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

    public Set<ClassSession> getTeachingSessions() {
        return teachingSessions;
    }

    public void setTeachingSessions(Set<ClassSession> teachingSessions) {
        this.teachingSessions = teachingSessions;
    }

    public String getInvitationToken() {
        return invitationToken;
    }

    public void setInvitationToken(String invitationToken) {
        this.invitationToken = invitationToken;
    }

    public Set<ClassSession> getAttendingSessions() {
        return attendingSessions;
    }

    public void setAttendingSessions(Set<ClassSession> attendingSessions) {
        this.attendingSessions = attendingSessions;
    }

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }

    public Date getInvitationAt() {
        return invitationAt;
    }

    public void setInvitationAt(Date invitationAt) {
        this.invitationAt = invitationAt;
    }
}