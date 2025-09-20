package com.doctrina.space.services;

import com.doctrina.space.entity.Account;
import com.doctrina.space.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    private final JavaMailSender mailSender;

    public AccountService(AccountRepository accountRepository, JavaMailSender mailSender) {
        this.mailSender = mailSender;
        this.accountRepository = accountRepository;
    }

    public Account createAccount(Account account) {
        Account savedAccount;
        try{

        String verificationToken = UUID.randomUUID().toString();
        account.setInvitationToken(verificationToken);
        String encodedEmail = URLEncoder.encode(account.getEmail(), StandardCharsets.UTF_8.toString());
        String verificationLink = "http://localhost:3000/complete?token=" + URLEncoder.encode(verificationToken, StandardCharsets.UTF_8.toString());
        System.out.println("Generated verification link: " + verificationLink);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(account.getEmail());
        message.setSubject("Verify Your Doctrina Space Account");
        message.setText("Hello,\n\nThank you for registering with Doctrina Space. Please complete your profile by " +
                "clicking the link below:\n" + verificationLink + "\n\n" +
                "This link is valid for 24 hours.\n\nBest regards,\nDoctrina Team");

            savedAccount  = accountRepository.save(account);

        mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return savedAccount;
    }

    public Account updateAccount(Account account) {
        return accountRepository.save(account);
    }

    public Optional<Account> findByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    public Optional<Account> findByVerificationToken(String verificationToken) {
        return accountRepository.findByVerificationToken(verificationToken);
    }

    public void deleteAccount(Long id) {
        accountRepository.deleteById(id);
    }

    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    public void banUser(Long id) {
        accountRepository.findById(id).ifPresent(account -> {
            account.setBanned(true);
            accountRepository.save(account);
        });
    }

    public void unBanUser(Long id) {
        accountRepository.findById(id).ifPresent(account -> {
            account.setBanned(false);
            accountRepository.save(account);
        });
    }

    public Optional<Account> findByInvitation(String token) {
        return accountRepository.findByInvitationToken(token);
    }
}