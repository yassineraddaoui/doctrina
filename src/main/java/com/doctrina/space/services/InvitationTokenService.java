package com.doctrina.space.services;

import com.doctrina.space.entity.InvitationToken;
import com.doctrina.space.entity.enums.RoleType;
import com.doctrina.space.repository.InvitationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvitationTokenService {
    private final InvitationTokenRepository tokenRepo;

    public InvitationToken generate(RoleType role, int daysValid) {
        String val = UUID.randomUUID().toString();
        InvitationToken t = InvitationToken.builder()
                .value(val)
                .role(role)
                .used(false)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(daysValid))
                .build();
        return tokenRepo.save(t);
    }

    public InvitationToken validate(String value) {
        return tokenRepo.findByValue(value)
                .filter(t -> !t.isUsed())
                .filter(t -> t.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElse(null);
    }

    public void markUsed(InvitationToken token) {
        token.setUsed(true);
        tokenRepo.save(token);
    }
}