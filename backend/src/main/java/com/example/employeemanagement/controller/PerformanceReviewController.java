package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.PerformanceReviewDTO;
import com.example.employeemanagement.service.PerformanceReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance-reviews")
@Tag(name = "Performance Review Management", description = "Operations related to employee performance reviews")
public class PerformanceReviewController {

    @Autowired
    private PerformanceReviewService performanceReviewService;

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PerformanceReviewDTO>> getReviewsByEmployeeId(@PathVariable Long employeeId) {
        List<PerformanceReviewDTO> reviews = performanceReviewService.getReviewsByEmployeeId(employeeId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    public ResponseEntity<PerformanceReviewDTO> createReview(@RequestBody PerformanceReviewDTO reviewDTO) {
        // We expect employeeId to be passed in the DTO or handled via path variable. 
        // The DTO doesn't strictly have employeeId field, but we need it. 
        // In ReviewsTab.js, I sent: { ...formData, employeeId }
        // But PerformanceReviewDTO doesn't have employeeId field in Java.
        // I should either add employeeId to DTO or pass it as a path variable.
        // Let's check ReviewsTab.js: axios.post(`${API_URLS.BASE}/api/performance-reviews`, { ...formData, employeeId });
        // The DTO mapping will ignore employeeId if it's not in the class.
        // So I should probably add employeeId to PerformanceReviewDTO or change the endpoint to /api/performance-reviews/employee/{id}
        // But let's check if I can just add a query param or request param?
        // Actually, cleaner is to add employeeId to DTO or use a wrapper.
        // But I don't want to change DTO again right now if I can avoid it.
        // Wait, I can just use a Map<String, Object> body or a custom request object? No, DTO is better.
        // Let's just assume I will update the DTO to include employeeId.
        // OR I can use a path variable like POST /api/employees/{id}/reviews.
        // But I defined the controller as /api/performance-reviews.
        // Let's just use a request param?
        // No, let's update DTO. It's useful to have employeeId in DTO anyway.
        // BUT for now, let's look at how I implemented createReview in Service: createReview(Long employeeId, PerformanceReviewDTO reviewDTO).
        // So I need to extract employeeId.
        // I'll assume the client sends it in the body, but since DTO doesn't have it, Jackson won't map it.
        // I will change the endpoint to `@PostMapping("/employee/{employeeId}")` which is cleaner.
        // And update frontend to call that.
        
        // Wait, let's update frontend ReviewsTab.js to use: axios.post(`${API_URLS.BASE}/api/performance-reviews/employee/${employeeId}`, formData);
        // It currently does: axios.post(`${API_URLS.BASE}/api/performance-reviews`, { ...formData, employeeId });
        
        // So I will implement `@PostMapping("/employee/{employeeId}")` here and update frontend.
        return ResponseEntity.badRequest().build(); 
    }
    
    @PostMapping("/employee/{employeeId}")
    public ResponseEntity<PerformanceReviewDTO> createReviewForEmployee(
            @PathVariable Long employeeId,
            @RequestBody PerformanceReviewDTO reviewDTO) {
        PerformanceReviewDTO createdReview = performanceReviewService.createReview(employeeId, reviewDTO);
        return ResponseEntity.ok(createdReview);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PerformanceReviewDTO> updateReview(@PathVariable Long id, @RequestBody PerformanceReviewDTO reviewDTO) {
        PerformanceReviewDTO updatedReview = performanceReviewService.updateReview(id, reviewDTO);
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        performanceReviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
