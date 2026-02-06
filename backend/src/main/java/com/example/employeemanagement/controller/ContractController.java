package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.ContractDTO;
import com.example.employeemanagement.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@Tag(name = "Contract Management", description = "Operations related to employee contracts")
public class ContractController {

    @Autowired
    private ContractService contractService;

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get contracts by employee ID")
    public ResponseEntity<List<ContractDTO>> getContractsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(contractService.getContractsByEmployeeId(employeeId));
    }

    @PostMapping
    @Operation(summary = "Create a new contract")
    public ResponseEntity<ContractDTO> createContract(@RequestBody ContractDTO dto) {
        return ResponseEntity.ok(contractService.createContract(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing contract")
    public ResponseEntity<ContractDTO> updateContract(@PathVariable Long id, @RequestBody ContractDTO dto) {
        return ResponseEntity.ok(contractService.updateContract(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a contract")
    public ResponseEntity<Void> deleteContract(@PathVariable Long id) {
        contractService.deleteContract(id);
        return ResponseEntity.noContent().build();
    }
}
