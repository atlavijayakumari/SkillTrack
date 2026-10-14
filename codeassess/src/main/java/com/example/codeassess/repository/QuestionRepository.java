package com.example.codeassess.repository;

import com.example.codeassess.entity.Question;
import com.example.codeassess.entity.Question.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByAssessmentId(Long assessmentId);

    List<Question> findByAssessmentIdAndQuestionType(
        Long assessmentId, QuestionType questionType
    );
}