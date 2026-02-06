package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.PositionDTO;
import com.example.employeemanagement.service.PositionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
@Tag(name = "Position Management", description = "Operations related to employee positions")
public class PositionController {

    @Autowired
    private PositionService positionService;

    @GetMapping
    @Operation(summary = "Get all positions")
    public ResponseEntity<List<PositionDTO>> getAllPositions() {
        return ResponseEntity.ok(positionService.getAllPositions());
    }

    @GetMapping("/division/{divisionId}")
    @Operation(summary = "Get positions by division")
    public ResponseEntity<List<PositionDTO>> getPositionsByDivision(@PathVariable Long divisionId) {
        return ResponseEntity.ok(positionService.getPositionsByDivision(divisionId));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get positions by employee ID")
    public ResponseEntity<List<PositionDTO>> getPositionsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(positionService.getPositionsByEmployeeId(employeeId));
    }

    @PostMapping
    @Operation(summary = "Create a new position")
    public ResponseEntity<PositionDTO> createPosition(@RequestBody PositionDTO dto) {
        return ResponseEntity.ok(positionService.createPosition(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing position")
    public ResponseEntity<PositionDTO> updatePosition(@PathVariable Long id, @RequestBody PositionDTO dto) {
        return ResponseEntity.ok(positionService.updatePosition(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a position")
    public ResponseEntity<Void> deletePosition(@PathVariable Long id) {
        positionService.deletePosition(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/assign/{employeeId}")
    @Operation(summary = "Assign employee to position")
    public ResponseEntity<PositionDTO> assignEmployee(@PathVariable Long id, @PathVariable Long employeeId) {
        return ResponseEntity.ok(positionService.assignEmployee(id, employeeId));
    }
    
    @PostMapping("/{id}/release")
    @Operation(summary = "Release position (remove employee)")
    public ResponseEntity<PositionDTO> releasePosition(@PathVariable Long id) {
        return ResponseEntity.ok(positionService.releasePosition(id));
    }
}
