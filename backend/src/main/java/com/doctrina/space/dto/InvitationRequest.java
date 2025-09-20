package com.doctrina.space.dto;

import com.doctrina.space.entity.enums.RoleType;

public class InvitationRequest {
    private RoleType role;
    private String email;
    private int daysValid = 1;

    public InvitationRequest() {
    }

    public InvitationRequest(RoleType role, String email, int daysValid) {
        this.role = role;
        this.email = email;
        this.daysValid = daysValid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }

    public int getDaysValid() {
        return daysValid;
    }

    public void setDaysValid(int daysValid) {
        this.daysValid = daysValid;
    }
}