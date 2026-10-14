package com.example.codeassess.service;

import com.example.codeassess.entity.Question;
import com.example.codeassess.entity.Assessment;
import com.example.codeassess.repository.QuestionRepository;
import com.example.codeassess.repository.AssessmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final AssessmentRepository assessmentRepository;

    public QuestionService(
            QuestionRepository questionRepository,
            AssessmentRepository assessmentRepository) {
        this.questionRepository = questionRepository;
        this.assessmentRepository = assessmentRepository;
    }

    public List<Question> getQuestions(Long assessmentId) {
        return questionRepository.findByAssessmentId(assessmentId);
    }

    public Question addQuestion(Long assessmentId, Question question) {

        Assessment assessment = assessmentRepository
                .findById(assessmentId)
                .orElseThrow(() ->
                        new RuntimeException("Assessment not found"));

        question.setAssessment(assessment);

        return questionRepository.save(question);
    }
}
