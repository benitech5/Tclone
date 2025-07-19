package com.qwadwocodes.orbixa.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.qwadwocodes.orbixa.features.profile.service.UserDetailsServiceImpl;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("=== JWT FILTER DEBUG ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Request Method: " + request.getMethod());

        // Skip JWT validation for authentication endpoints
        if (request.getRequestURI().startsWith("/api/auth/")) {
            System.out.println("Skipping JWT validation for auth endpoint");
            filterChain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");
        System.out.println("Authorization Header: " + authorizationHeader);

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            System.out.println("Extracted JWT: " + jwt.substring(0, Math.min(jwt.length(), 50)) + "...");
            try {
                username = jwtUtil.extractUsername(jwt);
                System.out.println("Extracted Username: " + username);
            } catch (Exception e) {
                System.out.println("Error extracting username: " + e.getMessage());
            }
        } else {
            System.out.println("No valid Authorization header found");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                System.out.println("UserDetails loaded: " + userDetails.getUsername());

                if (jwtUtil.isTokenValid(jwt, userDetails.getUsername())) {
                    System.out.println("JWT token is valid");
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    System.out.println("Authentication set in SecurityContext");
                } else {
                    System.out.println("JWT token is invalid");
                }
            } catch (Exception e) {
                System.out.println("Error loading user details: " + e.getMessage());
            }
        } else {
            System.out.println("Username is null or authentication already exists");
        }
        
        System.out.println("=== END JWT FILTER DEBUG ===");
        filterChain.doFilter(request, response);
    }
} 
