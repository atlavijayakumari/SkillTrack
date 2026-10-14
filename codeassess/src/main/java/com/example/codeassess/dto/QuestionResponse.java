
package com.example.codeassess.dto;

public class QuestionResponse {

    private Long id;
    private String questionText;
    private String questionType;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private int marks;

    public QuestionResponse() {
    }

    public QuestionResponse(Long id, String questionText,
            String questionType, String optionA,
            String optionB, String optionC,
            String optionD, int marks) {
        this.id = id;
        this.questionText = questionText;
        this.questionType = questionType;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.marks = marks;
    }

    public Long getId() {
        return id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public String getQuestionType() {
        return questionType;
    }

    public String getOptionA() {
        return optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public int getMarks() {
        return marks;
    }
}