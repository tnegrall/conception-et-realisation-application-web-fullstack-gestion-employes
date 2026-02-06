package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.EmployeeDTO;
import com.example.employeemanagement.mapper.EmployeeMapper;
import com.example.employeemanagement.model.Division;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.repository.DivisionRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/divisions")
@Tag(name = "Division Employee Management", description = "APIs for managing employees within divisions")
public class DivisionController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DivisionRepository divisionRepository;

    @Autowired
    private EmployeeMapper employeeMapper;

    @GetMapping("/{id}/employees")
    @Operation(summary = "Get employees by division", description = "Retrieve all employees in a specific division")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByDivision(@PathVariable Long id) {
        List<Employee> employees = employeeRepository.findByDivision_Id(id);
        return ResponseEntity.ok(employees.stream()
                .map(employeeMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @PostMapping("/{id}/assign/{employeeId}")
    @Operation(summary = "Assign employee to division", description = "Assign an employee to a specific division")
    public ResponseEntity<Void> assignEmployeeToDivision(@PathVariable Long id, @PathVariable Long employeeId) {
        Division division = divisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Division not found with id: " + id));
        
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        employee.setDivision(division);
        // Set derived fields (ServiceUnit and Direction) based on hierarchy
        if (division.getServiceUnit() != null) {
            employee.setServiceUnit(division.getServiceUnit());
            if (division.getServiceUnit().getDirection() != null) {
                employee.setDirection(division.getServiceUnit().getDirection());
            }
        }

        employeeRepository.save(employee);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/remove/{employeeId}")
    @Operation(summary = "Remove employee from division", description = "Remove an employee from a division")
    public ResponseEntity<Void> removeEmployeeFromDivision(@PathVariable Long id, @PathVariable Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        if (employee.getDivision() != null && employee.getDivision().getId().equals(id)) {
            employee.setDivision(null);
            // We keep Service/Direction as the employee might still belong to the Service
            employeeRepository.save(employee);
        } else {
             throw new ResourceNotFoundException("Employee is not in this division");
        }
        
        return ResponseEntity.ok().build();
    }
}