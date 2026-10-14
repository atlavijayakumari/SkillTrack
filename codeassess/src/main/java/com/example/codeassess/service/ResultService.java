
package com.example.codeassess.service;

import com.example.codeassess.entity.Result;
import com.example.codeassess.repository.ResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    private final ResultRepository resultRepository;

    public ResultService(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    public List<Result> getResultsByUser(Long userId) {
        return resultRepository.findByAttemptUserId(userId);
    }

    public Result saveResult(Result result) {
        return resultRepository.save(result);
    }
}