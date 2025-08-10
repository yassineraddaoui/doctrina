package com.doctrina.space.security;

import com.doctrina.space.dto.InvitationRequest;
import com.doctrina.space.entity.enums.RoleType;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class InvitationTokenHelper {

    @Value("${app.jwt.invitationSecret}")
    private String secret;

    public String generateToken(InvitationRequest invitationRequest) {
        Date now = new Date();
        // Correct expiry calculation (add milliseconds)
        Date expiryDate = new Date(now.getTime() + invitationRequest.getDaysValid() * 24 * 60 * 60 * 1000L);

        return Jwts.builder()
                .setSubject(invitationRequest.getEmail())
                .claim("role", invitationRequest.getRole()) // store role as a claim
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    // Validate token (returns true if valid, else false)
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token);
            return true;
        } catch (SignatureException | MalformedJwtException | ExpiredJwtException |
                 UnsupportedJwtException | IllegalArgumentException ex) {
            // log the exception if you want
            return false;
        }
    }

    // Extract email (subject) from token
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // Extract RoleType from token
    public RoleType getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
        String roleStr = claims.get("role", String.class);
        return RoleType.valueOf(roleStr);
    }
}
