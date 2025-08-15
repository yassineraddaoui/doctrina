package com.doctrina.space.controller;

import com.doctrina.space.dto.InvitationRequest;
import com.doctrina.space.dto.LoginRequest;
import com.doctrina.space.dto.RegisterRequest;
import com.doctrina.space.entity.Account;
import com.doctrina.space.entity.enums.RoleType;
import com.doctrina.space.security.InvitationTokenHelper;
import com.doctrina.space.security.JwtTokenProvider;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import com.doctrina.space.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider jwtProvider;
    @Autowired
    private AccountService accountService;
    @Autowired
    private InvitationTokenHelper invitationTokenHelper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private UserDetailsService userDetailsService;

    @Value("${server.port:8081}")
    private int serverPort;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        System.out.println("Login attempt for email: " + req.getEmail() + ", password: " + req.getPassword());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
            String token = jwtProvider.generateToken(userDetails);
            System.out.println("Login successful, generated token: " + token);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (AuthenticationException ex) {
            System.out.println("Login failed: " + ex.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            if (accountService.findByEmail(req.getEmail()).isPresent()) {
                return ResponseEntity.status(400).body(Map.of("error", "Email already registered"));
            }

            InvitationRequest invitationRequest = new InvitationRequest();
            invitationRequest.setEmail(req.getEmail());
            invitationRequest.setRole(req.getRole() != null ? req.getRole() : RoleType.TEACHER);
            invitationRequest.setDaysValid(1);
            String token = invitationTokenHelper.generateToken(invitationRequest);

            Account account = new Account();
            account.setEmail(req.getEmail());
            account.setFullName(req.getFullName());
            account.setPassword(passwordEncoder.encode(req.getPassword()));
            account.setRole(req.getRole() != null ? req.getRole() : RoleType.TEACHER);
            account.setInvitationToken(token);
            account.setInvitationAt(new Date());

            accountService.createAccount(account);

            String link = "http://localhost:" + serverPort + "/api/auth/login";
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(req.getEmail());
            message.setSubject("Registration Successful for Doctrina");
            message.setText("Hello " + req.getFullName() + ",\n\nYour registration with Doctrina is complete. Your invitation token is: " + token + "\nYou can log in using the link below:\n" + link + "\n\nEmail: " + req.getEmail() + "\nPassword: " + req.getPassword() + "\n\nBest regards,\nDoctrina Team");
            mailSender.send(message);

            return ResponseEntity.ok(Map.of("message", "Registration successful. Check your email for details."));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to register: " + ex.getMessage()));
        }
    }

    public Account findByEmail(String email) {
        return accountService.findByEmail(email).orElse(null);
    }
}