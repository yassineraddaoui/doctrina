package com.doctrina.space.controller;

import com.doctrina.space.dto.InvitationRequest;
import com.doctrina.space.entity.Account;
import com.doctrina.space.entity.enums.RoleType;
import com.doctrina.space.security.InvitationTokenHelper;
import com.doctrina.space.services.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private  AccountService accountService;
    @Autowired
    private  InvitationTokenHelper invitationTokenHelper;

    @Value("${server.port:8081}")
    private int serverPort;

    @PostMapping("/generate-invitation")
    public ResponseEntity<?> generateInvitation(@RequestBody InvitationRequest req) {
        String token=invitationTokenHelper.generateToken(req);
        Account a=new Account(req,token);
        accountService.createAccount(a);
        String link = "http://localhost:" + serverPort + "/api/auth/register?token=" + token;
        return ResponseEntity.ok(Map.of("token", token, "link", link));
    }

}