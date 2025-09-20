package com.doctrina.space.controller;

import com.doctrina.space.dto.InvitationRequest;
import com.doctrina.space.entity.Account;
import com.doctrina.space.entity.enums.RoleType;
import com.doctrina.space.security.InvitationTokenHelper;
import com.doctrina.space.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AccountService accountService;
    @Autowired
    private InvitationTokenHelper invitationTokenHelper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Value("${server.port:8081}")
    private int serverPort;

    @PostMapping("/generate-invitation")
    public ResponseEntity<?> generateInvitation(@RequestBody InvitationRequest req) {
        String token = invitationTokenHelper.generateToken(req);
        Account account = new Account(req, token);
        accountService.createAccount(account);
        String link = "http://localhost:" + serverPort + "/api/auth/register?token=" + token;
        return ResponseEntity.ok(Map.of("token", token, "link", link));
    }

    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody Account account) {
        try {
            if (accountService.findByEmail(account.getEmail()).isPresent()) {
                return ResponseEntity.status(400).body(Map.of("error", "Email already registered"));
            }

            if (account.getRole() == null) {
                account.setRole(RoleType.TEACHER);
            }
            accountService.createAccount(account);
            return ResponseEntity.ok(Map.of("message", "User created successfully", "email", account.getEmail()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create user: " + ex.getMessage()));
        }
    }

    @PutMapping("/update-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@RequestBody Account account) {
        Account existingAccount = accountService.findByEmail(account.getEmail()).orElse(null);
        if (existingAccount == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        existingAccount.setFullName(account.getFullName() != null ? account.getFullName() : existingAccount.getFullName());
        
        if (account.getRole() != null) {
            existingAccount.setRole(account.getRole());
        }

        accountService.updateAccount(existingAccount);
        return ResponseEntity.ok(Map.of("message", "User updated successfully", "email", account.getEmail()));
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<?> deleteUser(@RequestParam String email) {
        Account existingAccount = accountService.findByEmail(email).orElse(null);
        if (existingAccount == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        accountService.deleteAccount(existingAccount.getId()); // Use the ID
        return ResponseEntity.ok(Map.of("message", "User deleted successfully", "email", email));
    }
    @PutMapping("/ban-user")
    public ResponseEntity<?> banUser(@RequestParam String email) {
        Account existingAccount = accountService.findByEmail(email).orElse(null);
        if (existingAccount == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        accountService.banUser(existingAccount.getId()); // Use the ID
        return ResponseEntity.ok(Map.of("message", "User deleted successfully", "email", email));
    }
    @PutMapping("/unban-user")
    public ResponseEntity<?> unbanUser(@RequestParam String email) {
        Account existingAccount = accountService.findByEmail(email).orElse(null);
        if (existingAccount == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        accountService.unBanUser(existingAccount.getId()); // Use the ID
        return ResponseEntity.ok(Map.of("message", "User deleted successfully", "email", email));
    }
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        System.out.println("Fetching all users...");
        try {
            List<Account> users = accountService.findAll();
            System.out.println("Found users: " + users.size());
            return ResponseEntity.ok(users);
        } catch (Exception ex) {
            System.out.println("Failed to fetch users: " + ex.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch users: " + ex.getMessage()));
        }
    }
}