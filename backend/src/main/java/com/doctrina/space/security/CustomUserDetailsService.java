package com.doctrina.space.security;

import com.doctrina.space.entity.Account;
import com.doctrina.space.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        System.out.println("Loaded account email: " + account.getEmail() + ", password: " + account.getPassword() + ", role: " + account.getRole());
        return User.builder()
                .username(account.getEmail())
                .password(account.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + account.getRole().name())))
                .build();
    }
}