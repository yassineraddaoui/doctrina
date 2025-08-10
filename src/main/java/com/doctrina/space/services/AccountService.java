package com.doctrina.space.services;

import com.doctrina.space.entity.Account;
import com.doctrina.space.entity.InvitationToken;
import com.doctrina.space.repository.AccountRepository;
import com.doctrina.space.services.InvitationTokenService; // Corrected import
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepo;
    private final InvitationTokenService tokenService;
    private final BCryptPasswordEncoder passwordEncoder;

    public Account createProfessor(String fullName, String email, String rawPassword) {
        if (accountRepo.findByEmail(email).isPresent()) throw new RuntimeException("Email exists");
        Account a = Account.builder()
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .build();
        a.setRole(com.doctrina.space.entity.enums.RoleType.PROF);
        return accountRepo.save(a);
    }

    @Transactional
    public Account registerWithToken(String tokenValue, String fullName, String email, String rawPassword) {
        InvitationToken token = tokenService.validate(tokenValue);
        if (token == null) throw new RuntimeException("Invalid or expired token");
        if (accountRepo.findByEmail(email).isPresent()) throw new RuntimeException("Email already used");

        Account a = Account.builder()
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .role(token.getRole())
                .build();

        Account saved = accountRepo.save(a);
        tokenService.markUsed(token);
        return saved;
    }

    public Account findByEmail(String email) {
        return accountRepo.findByEmail(email).orElse(null);
    }
}