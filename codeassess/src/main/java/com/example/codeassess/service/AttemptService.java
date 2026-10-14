
package com.example.codeassess.service;

import com.example.codeassess.entity.Attempt;
import com.example.codeassess.repository.AttemptRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttemptService {

    private final AttemptRepository attemptRepository;

    public AttemptService(AttemptRepository attemptRepository) {
        this.attemptRepository = attemptRepository;
    }

    public List<Attempt> getAttemptsByUser(Long userId) {
        return attemptRepository.findByUserId(userId);
    }

    public Attempt startAttempt(Attempt attempt) {
        return attemptRepository.save(attempt);
    }
}