package com.doctrina.space.controller;

import com.doctrina.space.dto.InvitationRequest;
import com.doctrina.space.entity.InvitationToken;
import com.doctrina.space.entity.enums.RoleType;
import com.doctrina.space.services.AccountService;
import com.doctrina.space.services.InvitationTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final InvitationTokenService tokenService;
    private final AccountService accountService;

    @Value("${server.port:8081}")
    private int serverPort;

    @PostMapping("/generate-invitation")
    public ResponseEntity<?> generateInvitation(@RequestBody InvitationRequest req) {
        RoleType role = RoleType.valueOf(req.getRole());
        InvitationToken t = tokenService.generate(role, req.getDaysValid());
        String link = "http://localhost:" + serverPort + "/api/auth/register?token=" + t.getValue();
        return ResponseEntity.ok(Map.of("token", t.getValue(), "link", link));
    }

    @PostMapping("/create-prof")
    public ResponseEntity<?> createProf(@RequestBody Map<String,String> body) {
        String fullName = body.get("fullName");
        String email = body.get("email");
        String password = body.get("password");
        var prof = accountService.createProfessor(fullName, email, password);
        prof.setPassword(null);
        return ResponseEntity.ok(prof);
    }
}