package com.doctrina.space.entity;

import com.doctrina.space.dto.InvitationRequest;
import com.doctrina.space.entity.enums.RoleType;
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int verified; // Changed to int for 1

    private String email;
    private String fullName;
    private String password;
    @Enumerated(EnumType.STRING)
    private RoleType role;
    private String invitationToken;
    private Date invitationAt;

    private String verificationToken;
    private Date verificationAt;
    private Boolean banned;
    public Account() {}

    public Account(InvitationRequest req, String token) {
        this.email = req.getEmail();
        this.role = req.getRole() != null ? req.getRole() : RoleType.ADMIN;
        this.verificationToken = token;
        this.verificationAt = new Date();
    }

    public Boolean getBanned() {
        return banned;
    }

    public void setBanned(Boolean banned) {
        this.banned = banned;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public RoleType getRole() { return role; }
    public void setRole(RoleType role) { this.role = role; }

    public String getInvitationToken() { return invitationToken; }
    public void setInvitationToken(String invitationToken) { this.invitationToken = invitationToken; }

    public Date getInvitationAt() { return invitationAt; }
    public void setInvitationAt(Date invitationAt) { this.invitationAt = invitationAt; }

    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }

    public Date getVerificationAt() { return verificationAt; }
    public void setVerificationAt(Date verificationAt) { this.verificationAt = verificationAt; }


    public int getVerified() { return verified; }
    public void setVerified(int verified) { this.verified = verified; }
}