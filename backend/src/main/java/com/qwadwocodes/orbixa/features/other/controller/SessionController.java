package com.qwadwocodes.orbixa.features.other.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {
    @PostMapping("/refresh")
    public void refresh() {
        // TODO: Implement
    }

    @PostMapping("/logout")
    public void logout() {
        // TODO: Implement
    }
} 
