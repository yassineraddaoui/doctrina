package com.doctrina.space.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getServletPath();
        if (path.equals("/api/auth/login")) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        System.out.println("Received Authorization header: '" + header + "' for path: " + path);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            System.out.println("Extracted token: '" + token + "'");
            try {
                String email = jwtTokenProvider.getEmailFromToken(token);
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    if (jwtTokenProvider.validateToken(token)) {
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out.println("Authentication set for: " + email + " with authorities: " + userDetails.getAuthorities());
                    } else {
                        System.out.println("Token validation failed for: " + email + " - Token: " + token.substring(0, Math.min(10, token.length())) + "...");
                    }
                } else if (email == null) {
                    System.out.println("No email extracted from token for request: " + path + " - Token: " + token);
                } else {
                    System.out.println("Authentication already set for request: " + path);
                }
            } catch (Exception e) {
                System.out.println("Error processing token for request: " + path + " - Exception: " + e.getMessage() + " - Token: " + token);
            }
        } else {
            System.out.println("No Authorization header or invalid format for request: " + path + " - Header: " + header);
        }

        chain.doFilter(request, response);
    }
}