package com.doctrina.space.services;

import com.doctrina.space.entity.Account;
import com.doctrina.space.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
    @Autowired
    private  AccountRepository accountRepo;
    @Autowired
    private  BCryptPasswordEncoder passwordEncoder;
    public void createAccount(Account account) {
        if(account.getPassword()!=null && !account.getPassword().isEmpty()){
            account.setPassword(passwordEncoder.encode(account.getPassword()));
        }
        accountRepo.save(account);


    }
  }