package com.doctrina.space.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AccountCompleteDto {
    private String fullName;
    private String password;
    private String token;
}
