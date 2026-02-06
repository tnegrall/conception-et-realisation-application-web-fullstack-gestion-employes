package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.TrainingDTO;
import com.example.employeemanagement.service.TrainingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainings")
@Tag(name = "Training Management", description = "Operations related to employee trainings")
public class TrainingController {

    @Autowired
    private TrainingService trainingService;

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get trainings by employee ID")
    public ResponseEntity<List<TrainingDTO>> getTrainingsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(trainingService.getTrainingsByEmployeeId(employeeId));
    }

    @PostMapping("/employee/{employeeId}")
    @Operation(summary = "Create a new training for an employee")
    public ResponseEntity<TrainingDTO> createTraining(@PathVariable Long employeeId, @RequestBody TrainingDTO dto) {
        return ResponseEntity.ok(trainingService.createTraining(employeeId, dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing training")
    public ResponseEntity<TrainingDTO> updateTraining(@PathVariable Long id, @RequestBody TrainingDTO dto) {
        return ResponseEntity.ok(trainingService.updateTraining(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a training")
    public ResponseEntity<Void> deleteTraining(@PathVariable Long id) {
        trainingService.deleteTraining(id);
        return ResponseEntity.noContent().build();
    }
}
