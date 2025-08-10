package com.doctrina.space.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import com.doctrina.space.entity.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "accounts")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
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
    @Builder.Default
    private Set<ClassSession> teachingSessions = new HashSet<>();

    @ManyToMany(mappedBy = "students")
    @Builder.Default
    private Set<ClassSession> attendingSessions = new HashSet<>();
}