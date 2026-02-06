package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.EmployeeDTO;
import com.example.employeemanagement.dto.EmployeeActionDTO;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.service.EmployeeService;
import com.example.employeemanagement.service.OrganizationService;
import com.example.employeemanagement.service.EmployeeActionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.employeemanagement.dto.EmployeePhotoDTO;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.springframework.http.MediaType;

/** This class represents the REST API controller for employees. */
@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employees APIs", description = "API Operations related to managing employees")
public class EmployeeController {

  /** The employee service. */
  @Autowired private EmployeeService employeeService;
  @Autowired private EmployeeActionService employeeActionService;
  @Autowired private com.example.employeemanagement.service.PdfGeneratorService pdfGeneratorService;

  /**
   * Récupère tous les employés.
   */
  @Operation(summary = "Get all employees", description = "Retrieve a list of all employees")
  @GetMapping
  public List<EmployeeDTO> getAllEmployees() {
    return employeeService.getAllEmployees();
  }

  @Operation(
      summary = "Get employees with pagination",
      description = "Retrieve a paginated list of employees for dashboard usage")
  @GetMapping("/filter")
  public ResponseEntity<Page<EmployeeDTO>> getEmployeesPage(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(defaultValue = "lastName,asc") String sort) {
    if (size > 100) {
      size = 100;
    }
    String[] sortParts = sort.split(",");
    String sortField = sortParts[0];
    Sort.Direction direction =
        sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1])
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;
    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
    Page<EmployeeDTO> result = employeeService.getEmployeesPage(pageable);
    return ResponseEntity.ok(result);
  }

  @Operation(
      summary = "Get last updated timestamp",
      description = "Retrieve the most recent update timestamp for employees")
  @GetMapping("/last-updated")
  public ResponseEntity<Map<String, String>> getLastUpdated() {
    Instant lastUpdated = employeeService.getLastUpdatedAt();
    Map<String, String> body = new HashMap<>();
    body.put("lastUpdated", lastUpdated != null ? lastUpdated.toString() : null);
    return ResponseEntity.ok(body);
  }

  /**
   * Récupère un employé par son identifiant.
   */
  @Operation(
      summary = "Get employee by ID",
      description = "Retrieve a specific employee by their ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Employee found"),
        @ApiResponse(responseCode = "404", description = "Employee not found")
      })
  @GetMapping("/{id}")
  public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
    EmployeeDTO employee =
        employeeService
            .getEmployeeById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employé introuvable avec l'identifiant : " + id));
    return ResponseEntity.ok(employee);
  }

  /**
   * Crée un nouvel employé.
   */
  @Operation(summary = "Create a new employee", description = "Create a new employee record")
  @PostMapping
  public EmployeeDTO createEmployee(@Valid @RequestBody EmployeeDTO employeeDTO, @RequestHeader(value = "X-Actor", required = false) String actor) {
    return employeeService.createEmployee(employeeDTO, actor);
  }

  /**
   * Met à jour un employé existant.
   */
  @Operation(
      summary = "Update an existing employee",
      description = "Update an existing employee's details")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Employé mis à jour"),
        @ApiResponse(responseCode = "404", description = "Employé introuvable")
      })
  @PutMapping("/{id}")
  public ResponseEntity<EmployeeDTO> updateEmployee(
      @PathVariable Long id, @Valid @RequestBody EmployeeDTO employeeDetails, @RequestHeader(value = "X-Actor", required = false) String actor) {
    EmployeeDTO updatedEmployee = employeeService.updateEmployee(id, employeeDetails, actor);
    return ResponseEntity.ok(updatedEmployee);
  }

  /**
   * Supprime un employé.
   */
  @Operation(summary = "Delete an employee", description = "Delete an employee record by ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Employé supprimé"),
        @ApiResponse(responseCode = "404", description = "Employé introuvable")
      })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteEmployee(@PathVariable Long id, @RequestHeader(value = "X-Actor", required = false) String actor) {
    employeeService.deleteEmployee(id, actor);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}/actions")
  @Operation(summary = "Get employee actions", description = "Retrieve RH action history for an employee")
  public ResponseEntity<List<EmployeeActionDTO>> getEmployeeActions(@PathVariable Long id) {
    return ResponseEntity.ok(employeeActionService.getActionsForEmployee(id));
  }

  @PostMapping(value = "/{id}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Upload profile photo", description = "Upload a profile photo for the employee (max 2MB, JPG/PNG)")
  public ResponseEntity<String> uploadPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
      if (file.isEmpty()) {
          return ResponseEntity.badRequest().body("Please select a file to upload");
      }
      if (file.getSize() > 2 * 1024 * 1024) {
          return ResponseEntity.badRequest().body("File size exceeds 2MB limit");
      }
      if (!List.of("image/jpeg", "image/png").contains(file.getContentType())) {
          return ResponseEntity.badRequest().body("Only JPG and PNG formats are allowed");
      }
      
      try {
          employeeService.uploadPhoto(id, file);
          return ResponseEntity.ok("Photo uploaded successfully");
      } catch (IOException e) {
          return ResponseEntity.internalServerError().body("Could not upload photo: " + e.getMessage());
      }
  }

  @GetMapping("/{id}/photo")
  @Operation(summary = "Get profile photo", description = "Retrieve the profile photo as base64 DTO")
  public ResponseEntity<EmployeePhotoDTO> getPhoto(@PathVariable Long id) {
      EmployeePhotoDTO dto = employeeService.getPhoto(id);
      if (dto == null) {
          return ResponseEntity.notFound().build();
      }
      return ResponseEntity.ok(dto);
  }

  @GetMapping("/{id}/pdf")
    @Operation(summary = "Generate Employee PDF", description = "Generate a PDF file for the employee profile")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER', 'MANAGER')")
    public ResponseEntity<byte[]> generatePdf(@PathVariable Long id) {
        EmployeeDTO employee = employeeService.getEmployeeById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employé introuvable avec l'identifiant : " + id));

        List<EmployeeActionDTO> history = employeeActionService.getActionsForEmployee(id);

        EmployeePhotoDTO photoDTO = employeeService.getPhoto(id);
        String photoBase64 = null;
        if (photoDTO != null && photoDTO.getBase64Image() != null) {
            // Check if already has prefix
            if (photoDTO.getBase64Image().startsWith("data:")) {
                photoBase64 = photoDTO.getBase64Image();
            } else {
                photoBase64 = "data:" + photoDTO.getContentType() + ";base64," + photoDTO.getBase64Image();
            }
        }

        byte[] pdfBytes = pdfGeneratorService.generateEmployeePdf(employee, history, photoBase64);

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.set("Content-Disposition", "inline; filename=fiche_employe_" + employee.getMatricule() + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
    }

  @PutMapping("/{id}/change-division/{divisionId}")
  @Operation(summary = "Change employee division", description = "Reassign an employee to a different division")
  public ResponseEntity<Void> changeEmployeeDivision(@PathVariable Long id, @PathVariable Long divisionId, @RequestHeader(value = "X-Actor", required = false) String actor) {
      employeeService.changeDivision(id, divisionId, actor);
      return ResponseEntity.ok().build();
  }
}
