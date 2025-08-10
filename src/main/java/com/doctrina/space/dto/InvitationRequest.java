package com.doctrina.space.dto;

import lombok.Data;

@Data
public class InvitationRequest {
    private String role; // PROF / STUDENT / PARENT
    private int daysValid = 1;
}
