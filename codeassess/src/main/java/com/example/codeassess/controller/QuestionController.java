package com.example.codeassess.controller;

import com.example.codeassess.entity.Question;
import com.example.codeassess.service.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/assessment/{assessmentId}")
    public List<Question> getQuestions(
            @PathVariable Long assessmentId) {
        return questionService.getQuestions(assessmentId);
    }

    @PostMapping("/assessment/{assessmentId}")
    public ResponseEntity<?> addQuestion(
            @PathVariable Long assessmentId,
            @RequestBody Question question) {

        try {
            Question saved = questionService.addQuestion(
                    assessmentId, question);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Question added successfully",
                            "id", saved.getId()
                    )
            );

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", ex.getMessage())
            );
        }
    }
}
