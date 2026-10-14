
package com.example.codeassess.controller;

import com.example.codeassess.entity.Result;
import com.example.codeassess.service.ResultService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping("/user/{userId}")
    public List<Result> getResults(@PathVariable Long userId) {
        return resultService.getResultsByUser(userId);
    }
}