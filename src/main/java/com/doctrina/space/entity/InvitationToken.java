package com.doctrina.space.entity;

import jakarta.persistence.*;
import com.doctrina.space.entity.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitation_tokens")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InvitationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "value", nullable = false)
    private String value;

    @Column(name = "role", nullable = false, columnDefinition = "VARCHAR(50)") // Explicitly define as VARCHAR
    @Enumerated(EnumType.STRING)
    private RoleType role;

    @Builder.Default
    private boolean used = false;

    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;
}