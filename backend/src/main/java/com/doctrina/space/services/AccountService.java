package com.doctrina.space.services;

import com.doctrina.space.entity.Account;
import com.doctrina.space.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account createAccount(Account account) {
        return accountRepository.save(account);
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
}