package com.example.employeemanagement.controller;

import com.example.employeemanagement.model.Direction;
import com.example.employeemanagement.model.Division;
import com.example.employeemanagement.model.ServiceUnit;
import com.example.employeemanagement.service.OrganizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organization")
@Tag(name = "Organization APIs", description = "API Operations related to DGI Organization Structure")
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @Operation(summary = "Get Organization Structure", description = "Retrieve the full hierarchical structure (Direction -> Service -> Division)")
    @GetMapping
    public List<Direction> getOrganizationStructure() {
        return organizationService.getOrganizationStructure();
    }

    // --- Directions ---
    @GetMapping("/directions/{id}")
    public ResponseEntity<Direction> getDirectionById(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.getDirectionById(id));
    }

    @PostMapping("/directions")
    public ResponseEntity<Direction> createDirection(@RequestBody Direction direction) {
        return ResponseEntity.ok(organizationService.createDirection(direction));
    }

    @PutMapping("/directions/{id}")
    public ResponseEntity<Direction> updateDirection(@PathVariable Long id, @RequestBody Direction direction) {
        return ResponseEntity.ok(organizationService.updateDirection(id, direction));
    }

    @DeleteMapping("/directions/{id}")
    public ResponseEntity<Void> deleteDirection(@PathVariable Long id) {
        organizationService.deleteDirection(id);
        return ResponseEntity.noContent().build();
    }

    // --- Services ---
    @GetMapping("/services/{id}")
    public ResponseEntity<ServiceUnit> getServiceUnitById(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.getServiceUnitById(id));
    }

    @PostMapping("/services")
    public ResponseEntity<ServiceUnit> createServiceUnit(@RequestParam Long directionId, @RequestBody ServiceUnit serviceUnit) {
        return ResponseEntity.ok(organizationService.createServiceUnit(directionId, serviceUnit));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<ServiceUnit> updateServiceUnit(@PathVariable Long id, @RequestBody ServiceUnit serviceUnit) {
        return ResponseEntity.ok(organizationService.updateServiceUnit(id, serviceUnit));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteServiceUnit(@PathVariable Long id) {
        organizationService.deleteServiceUnit(id);
        return ResponseEntity.noContent().build();
    }

    // --- Divisions ---
    @GetMapping("/divisions/{id}")
    public ResponseEntity<Division> getDivisionById(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.getDivisionById(id));
    }

    @PostMapping("/divisions")
    public ResponseEntity<Division> createDivision(@RequestParam Long serviceId, @RequestBody Division division) {
        return ResponseEntity.ok(organizationService.createDivision(serviceId, division));
    }

    @PutMapping("/divisions/{id}")
    public ResponseEntity<Division> updateDivision(@PathVariable Long id, @RequestBody Division division) {
        return ResponseEntity.ok(organizationService.updateDivision(id, division));
    }

    @DeleteMapping("/divisions/{id}")
    public ResponseEntity<Void> deleteDivision(@PathVariable Long id) {
        organizationService.deleteDivision(id);
        return ResponseEntity.noContent().build();
    }

    // --- Employee Counts ---

    @GetMapping("/directions/{id}/employee-count")
    public ResponseEntity<Long> getDirectionEmployeeCount(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.countEmployeesByDirection(id));
    }

    @GetMapping("/services/{id}/employee-count")
    public ResponseEntity<Long> getServiceUnitEmployeeCount(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.countEmployeesByServiceUnit(id));
    }

    @GetMapping("/divisions/{id}/employee-count")
    public ResponseEntity<Long> getDivisionEmployeeCount(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.countEmployeesByDivision(id));
    }

    // --- Division Employees Management ---
    @GetMapping("/divisions/{id}/employees")
    public ResponseEntity<List<com.example.employeemanagement.model.Employee>> getEmployeesByDivision(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.getEmployeesByDivision(id));
    }

    @PostMapping("/divisions/{id}/assign/{employeeId}")
    public ResponseEntity<Void> assignEmployeeToDivision(@PathVariable Long id, @PathVariable Long employeeId, @RequestHeader(value = "X-Actor", required = false) String actor) {
        organizationService.assignEmployeeToDivision(id, employeeId, actor);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/divisions/{id}/remove/{employeeId}")
    public ResponseEntity<Void> removeEmployeeFromDivision(@PathVariable Long id, @PathVariable Long employeeId, @RequestHeader(value = "X-Actor", required = false) String actor) {
        organizationService.removeEmployeeFromDivision(id, employeeId, actor);
        return ResponseEntity.ok().build();
    }
}
