
package com.example.codeassess.controller;

import com.example.codeassess.entity.Attempt;
import com.example.codeassess.service.AttemptService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attempts")
@CrossOrigin(origins = "*")
public class AttemptController {

    private final AttemptService attemptService;

    public AttemptController(AttemptService attemptService) {
        this.attemptService = attemptService;
    }

    @GetMapping("/user/{userId}")
    public List<Attempt> getAttempts(@PathVariable Long userId) {
        return attemptService.getAttemptsByUser(userId);
    }
}