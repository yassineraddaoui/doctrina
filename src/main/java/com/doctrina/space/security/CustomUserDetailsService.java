package com.doctrina.space.security;

import com.doctrina.space.entity.Account;
import com.doctrina.space.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
 public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private  AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account a = accountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return User.builder()
                .username(a.getEmail())
                .password(a.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + a.getRole().name())))
                .build();
    }
}
