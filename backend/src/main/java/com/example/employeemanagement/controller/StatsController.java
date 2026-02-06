package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.DashboardStatsDTO;
import com.example.employeemanagement.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@Tag(name = "Stats APIs", description = "API Operations related to dashboard statistics")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @Operation(summary = "Get dashboard statistics", description = "Retrieve aggregated statistics for dashboard")
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(statsService.getDashboardStats());
    }
}
