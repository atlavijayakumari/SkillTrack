
package com.example.codeassess.dto;

public class AssessmentResponse {

    private Long id;
    private String title;
    private String description;
    private int durationMinutes;
    private int totalMarks;

    public AssessmentResponse() {
    }

    public AssessmentResponse(Long id, String title,
            String description, int durationMinutes,
            int totalMarks) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.totalMarks = totalMarks;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public int getTotalMarks() {
        return totalMarks;
    }
}