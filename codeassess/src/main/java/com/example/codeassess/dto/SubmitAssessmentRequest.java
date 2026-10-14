
package com.example.codeassess.dto;

import java.util.Map;

public class SubmitAssessmentRequest {

    private Long assessmentId;
    private Map<Long, String> answers;

    public SubmitAssessmentRequest() {
    }

    public SubmitAssessmentRequest(
            Long assessmentId, Map<Long, String> answers) {
        this.assessmentId = assessmentId;
        this.answers = answers;
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public Map<Long, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, String> answers) {
        this.answers = answers;
    }
}