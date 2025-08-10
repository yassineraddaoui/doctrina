package com.doctrina.space.controller;

import com.doctrina.space.dto.LoginRequest;
import com.doctrina.space.dto.RegisterRequest;
import com.doctrina.space.entity.Account;
import com.doctrina.space.security.JwtTokenProvider;
import com.doctrina.space.services.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException; // ✅ FIXED IMPORT
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtProvider;
    private final AccountService accountService;

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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            Account a = accountService.registerWithToken(
                    req.getToken(), req.getFullName(), req.getEmail(), req.getPassword()
            );
            a.setPassword(null);
            return ResponseEntity.ok(a);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
