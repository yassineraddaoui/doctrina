package com.doctrina.space.controller;

import com.doctrina.space.dto.LoginRequest;
import com.doctrina.space.dto.RegisterRequest;
import com.doctrina.space.entity.Account;
import com.doctrina.space.security.JwtTokenProvider;
import com.doctrina.space.services.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException; // ✅ FIXED IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private  AuthenticationManager authenticationManager;
    @Autowired
    private  JwtTokenProvider jwtProvider;
    @Autowired
    private  AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
            String token = jwtProvider.generateToken(req.getEmail());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (AuthenticationException ex) { // ✅ Now resolved
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

}
