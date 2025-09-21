package com.doctrina.space.controller;

import com.doctrina.space.dto.AccountCompleteDto;
import com.doctrina.space.dto.InvitationRequest;
import com.doctrina.space.dto.LoginRequest;
import com.doctrina.space.dto.RegisterRequest;
import com.doctrina.space.entity.Account;
import com.doctrina.space.entity.enums.RoleType;
import com.doctrina.space.security.InvitationTokenHelper;
import com.doctrina.space.security.JwtTokenProvider;
import com.doctrina.space.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

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
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
            UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
            String token = jwtProvider.generateToken(userDetails);
            System.out.println("Login successful, generated token: " + token);
            String authority = userDetails.getAuthorities().iterator().next().getAuthority();
            if (authority.startsWith("ROLE_")) {
                authority = authority.substring(5); // remove "ROLE_" prefix
            }

            return ResponseEntity.ok(Map.of("token", token, "role", authority));

        } catch (AuthenticationException ex) {
            System.out.println("Login failed: " + ex.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        try {
            String email = req.get("email");
            String firstName = req.get("firstName");
            String lastName = req.get("lastName");
            String password = req.get("password");
            String role = req.get("role");
            System.out.println("Registering email: " + email + ", firstName: " + firstName + ", lastName: " + lastName + ", role: " + role);

            if (email == null || email.trim().isEmpty() || firstName == null || firstName.trim().isEmpty() ||
                    lastName == null || lastName.trim().isEmpty() || password == null || password.trim().isEmpty() ||
                    role == null || role.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));
            }
            if (accountService.findByEmail(email).isPresent()) {
                return ResponseEntity.status(400).body(Map.of("error", "Email already registered"));
            }

            String verificationToken = UUID.randomUUID().toString();
            System.out.println("Generated verification token: " + verificationToken);

            Account account = new Account();
            account.setEmail(email);
            account.setFullName(firstName + " " + lastName);
            account.setPassword(passwordEncoder.encode(password));
            account.setRole(RoleType.valueOf(role.toUpperCase()));
            account.setVerificationToken(verificationToken);
            account.setVerificationAt(new Date());
            accountService.createAccountRegister(account);

            String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8.toString());
            String verificationLink = "http://localhost:3000/verify?token=" + URLEncoder.encode(verificationToken, StandardCharsets.UTF_8.toString());
            System.out.println("Generated verification link: " + verificationLink);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Verify Your Doctrina Space Account");
            message.setText("Hello,\n\nThank you for registering with Doctrina Space. Please verify your email by clicking the link below:\n" + verificationLink + "\n\nThis link is valid for 24 hours.\n\nBest regards,\nDoctrina Team");
            mailSender.send(message);

            return ResponseEntity.ok(Map.of("message", "Verify your email. A verification link has been sent to " + email, "verificationToken", verificationToken));
        } catch (Exception ex) {
            System.out.println("Registration error: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to register: " + ex.getMessage()));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        try {
            System.out.println("Received verification request for token: " + token);
            Account account = accountService.findByVerificationToken(token).orElse(null);
            if (account == null) {
                System.out.println("Token not found in database");
                return ResponseEntity.status(400).body(Map.of("error", "Invalid token"));
            }

            System.out.println("Account found: email=" + account.getEmail() + ", verified=" + account.getVerified() + ", verificationAt=" + account.getVerificationAt());
            if (account.getVerified() == 1) {
                System.out.println("Email already verified");
                return ResponseEntity.ok().build();
            }

            if (account.getVerificationAt() == null || account.getVerificationAt().before(new Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000))) {
                System.out.println("Token expired or invalid verificationAt");
                return ResponseEntity.status(400).body(Map.of("error", "Expired token"));
            }

            account.setVerified(1); // Set verified to 1
            account.setVerificationToken(null);
            account.setVerificationAt(null);
            accountService.updateAccount(account);
            System.out.println("Verification successful, updated account: email=" + account.getEmail() + ", verified=1");

            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            System.out.println("Verification error: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Verification failed: " + ex.getMessage()));
        }
    }
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateUser(@RequestBody AccountCompleteDto account) {

        Account existingAccount = accountService.findByInvitation(account.getToken())
                .orElse(null);
        if (existingAccount == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        existingAccount.setFullName(account.getFullName() != null ? account.getFullName() : existingAccount.getFullName());
        existingAccount.setPassword(passwordEncoder.encode(account.getPassword()));


        accountService.updateAccount(existingAccount);
        return ResponseEntity.ok(Map.of("message", "User updated successfully"));
    }

}