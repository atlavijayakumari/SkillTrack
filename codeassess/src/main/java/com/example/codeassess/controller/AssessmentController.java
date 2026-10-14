
package com.example.codeassess.controller;

import com.example.codeassess.entity.Assessment;
import com.example.codeassess.service.AssessmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "*")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    public List<Assessment> getAssessments() {
        return assessmentService.getActiveAssessments();
    }

    @GetMapping("/{id}")
    public Assessment getAssessment(@PathVariable Long id) {
        return assessmentService.getAssessmentById(id);
    }
    

	@PostMapping
	public Assessment createAssessment(@RequestBody Assessment assessment) {
	    return assessmentService.createAssessment(assessment);
	}
}