package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.EmployeeDTO;
import com.example.employeemanagement.dto.EmployeePhotoDTO;
import com.example.employeemanagement.exception.ConflictException;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.mapper.EmployeeMapper;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.model.JobTemplate;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.repository.JobTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;

/** This class represents the service for employees. */
@Service
public class EmployeeService {

  /** The employee repository. */
  @Autowired private EmployeeRepository employeeRepository;

  @Autowired private com.example.employeemanagement.repository.DivisionRepository divisionRepository;

  @Autowired private com.example.employeemanagement.repository.ServiceUnitRepository serviceUnitRepository;

  @Autowired private com.example.employeemanagement.repository.DirectionRepository directionRepository;

  @Autowired private JobTemplateRepository jobTemplateRepository;

  @Autowired private EmployeeMapper employeeMapper;

  @Autowired private EmployeeActionService employeeActionService;

  @PostConstruct
  public void cleanUpDuplicates() {
      List<String> duplicateMatricules = employeeRepository.findDuplicateMatricules();
      for (String matricule : duplicateMatricules) {
          if (matricule == null) continue;
          List<Employee> employees = employeeRepository.findAllByMatricule(matricule);
          if (employees.size() > 1) {
              // Keep the one with the latest update or creation
              employees.sort((e1, e2) -> {
                  Instant t1 = e1.getUpdatedAt() != null ? e1.getUpdatedAt() : e1.getCreatedAt();
                  Instant t2 = e2.getUpdatedAt() != null ? e2.getUpdatedAt() : e2.getCreatedAt();
                  if (t1 == null && t2 == null) return 0;
                  if (t1 == null) return 1;
                  if (t2 == null) return -1;
                  return t2.compareTo(t1); // Descending
              });
              // Keep index 0, delete others
              for (int i = 1; i < employees.size(); i++) {
                  employeeRepository.delete(employees.get(i));
                  System.out.println("Deleted duplicate employee with matricule " + matricule + " and ID " + employees.get(i).getId());
              }
          }
      }
  }

  /**
   * Get all employees.
   *
   * @return List of all employees
   */
  public List<EmployeeDTO> getAllEmployees() {
    return employeeRepository.findAllWithDivisions().stream()
        .map(employeeMapper::toDTO)
        .collect(Collectors.toList());
  }

  /**
   * Get employee by ID.
   *
   * @param id ID of the employee to be retrieved
   * @return Employee with the specified ID
   */
  public Optional<EmployeeDTO> getEmployeeById(Long id) {
    return employeeRepository.findById(id).map(employeeMapper::toDTO);
  }

  /**
   * Create a new employee.
   *
   * @param employeeDTO Employee DTO
   * @return Created employee DTO
   */
  @Transactional
  public EmployeeDTO createEmployee(EmployeeDTO employeeDTO, String actor) {
    if (employeeRepository.findByEmail(employeeDTO.getEmail()).isPresent()) {
      throw new ConflictException("Un employé avec cet email existe déjà");
    }
    if (employeeDTO.getMatricule() != null && employeeRepository.findByMatricule(employeeDTO.getMatricule()).isPresent()) {
      throw new ConflictException("Un employé avec ce matricule existe déjà");
    }
    Employee employee = employeeMapper.toEntity(employeeDTO);

    applyOrganizationLinks(employeeDTO, employee);

    if (employeeDTO.getJobTemplateId() != null && employeeDTO.getJobTemplateId() > 0) {
      JobTemplate jobTemplate = jobTemplateRepository.findById(employeeDTO.getJobTemplateId())
          .orElseThrow(() -> new ResourceNotFoundException("JobTemplate not found with id: " + employeeDTO.getJobTemplateId()));
      employee.setJobTemplate(jobTemplate);
    }

    Employee savedEmployee = employeeRepository.save(employee);
    employeeActionService.logAction(savedEmployee, "CREATION", actor, "Création de la fiche employé");
    return employeeMapper.toDTO(savedEmployee);
  }

  /**
   * Update an existing employee.
   *
   * @param id ID of the employee
   * @param employeeDTO Updated employee DTO
   * @return Updated employee DTO
   */
  @Transactional
  public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO, String actor) {
    Employee existingEmployee = employeeRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

    if (employeeDTO.getEmail() != null && !employeeDTO.getEmail().equalsIgnoreCase(existingEmployee.getEmail())) {
      employeeRepository.findByEmail(employeeDTO.getEmail())
          .filter(emp -> !emp.getId().equals(id))
          .ifPresent(emp -> {
            throw new ConflictException("Un employé avec cet email existe déjà");
          });
    }

    if (employeeDTO.getMatricule() != null && !employeeDTO.getMatricule().equalsIgnoreCase(existingEmployee.getMatricule())) {
      employeeRepository.findByMatricule(employeeDTO.getMatricule())
          .filter(emp -> !emp.getId().equals(id))
          .ifPresent(emp -> {
            throw new ConflictException("Un employé avec ce matricule existe déjà");
          });
    }

    employeeMapper.updateEntityFromDTO(employeeDTO, existingEmployee);

    applyOrganizationLinks(employeeDTO, existingEmployee);

    if (employeeDTO.getJobTemplateId() != null) {
      JobTemplate jobTemplate = jobTemplateRepository.findById(employeeDTO.getJobTemplateId())
          .orElseThrow(() -> new ResourceNotFoundException("JobTemplate not found with id: " + employeeDTO.getJobTemplateId()));
      existingEmployee.setJobTemplate(jobTemplate);
    } else {
      existingEmployee.setJobTemplate(null);
    }

    Employee updatedEmployee = employeeRepository.save(existingEmployee);
    employeeActionService.logAction(updatedEmployee, "MISE_A_JOUR", actor, "Mise à jour de la fiche employé");
    return employeeMapper.toDTO(updatedEmployee);
  }

  /**
   * Delete an employee.
   *
   * @param id ID of the employee to be deleted
   */
  @Transactional
  public void deleteEmployee(Long id, String actor) {
    Employee employee = employeeRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    employeeActionService.logAction(employee, "SUPPRESSION", actor, "Suppression de la fiche employé");
    employeeRepository.deleteById(id);
  }

  /**
   * Upload profile photo for an employee.
   *
   * @param id Employee ID
   * @param file Multipart file
   * @throws IOException if file processing fails
   */
  @Transactional
  public void uploadPhoto(Long id, MultipartFile file) throws IOException {
      if (!employeeRepository.existsById(id)) {
           throw new ResourceNotFoundException("Employee not found with id: " + id);
      }
      employeeRepository.updatePhotoByEmployeeId(id, file.getBytes(), file.getContentType());
  }

  /**
   * Get profile photo for an employee.
   *
   * @param id Employee ID
   * @return EmployeePhotoDTO containing base64 encoded image
   */
  @Transactional(readOnly = true)
  public EmployeePhotoDTO getPhoto(Long id) {
      Employee employee = employeeRepository.findById(id)
          .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
      
      if (employee.getProfilePhoto() == null) {
          return null;
      }
      
      EmployeePhotoDTO dto = new EmployeePhotoDTO();
      dto.setEmployeeId(id);
      dto.setBase64Image(Base64.getEncoder().encodeToString(employee.getProfilePhoto()));
      dto.setContentType(employee.getPhotoType());
      return dto;
  }

  public Instant getLastUpdatedAt() {
    return employeeRepository.findMaxUpdatedAt();
  }

  public Page<EmployeeDTO> getEmployeesPage(Pageable pageable) {
    return employeeRepository.findAll(pageable).map(employeeMapper::toDTO);
  }

  @Transactional
  public void changeDivision(Long employeeId, Long divisionId, String actor) {
      checkAuthorization(actor);
      Employee employee = employeeRepository.findById(employeeId)
          .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
      
      com.example.employeemanagement.model.Division division = divisionRepository.findById(divisionId)
          .orElseThrow(() -> new ResourceNotFoundException("Division not found with id: " + divisionId));

      employee.setDivision(division);
      if (division.getServiceUnit() != null) {
          employee.setServiceUnit(division.getServiceUnit());
          if (division.getServiceUnit().getDirection() != null) {
              employee.setDirection(division.getServiceUnit().getDirection());
          }
      }
      employeeRepository.save(employee);
      employeeActionService.logAction(employee, "CHANGEMENT_DIVISION", actor, "Changement de division vers : " + division.getName());
  }

  private void checkAuthorization(String actor) {
      if (actor == null || (!actor.equalsIgnoreCase("ADMIN") && !actor.equalsIgnoreCase("RH"))) {
           throw new org.springframework.security.access.AccessDeniedException("Unauthorized: Only ADMIN and RH can perform this action.");
      }
  }

  private void applyOrganizationLinks(EmployeeDTO employeeDTO, Employee employee) {
    Long divisionId = employeeDTO.getDivisionId() != null && employeeDTO.getDivisionId() > 0 ? employeeDTO.getDivisionId() : null;
    Long serviceUnitId = employeeDTO.getServiceUnitId() != null && employeeDTO.getServiceUnitId() > 0 ? employeeDTO.getServiceUnitId() : null;
    Long directionId = employeeDTO.getDirectionId() != null && employeeDTO.getDirectionId() > 0 ? employeeDTO.getDirectionId() : null;

    if (divisionId != null) {
      com.example.employeemanagement.model.Division division = divisionRepository.findById(divisionId)
          .orElseThrow(() -> new ResourceNotFoundException("Division not found with id: " + divisionId));
      employee.setDivision(division);
      com.example.employeemanagement.model.ServiceUnit serviceUnit = division.getServiceUnit();
      employee.setServiceUnit(serviceUnit);
      employee.setDirection(serviceUnit != null ? serviceUnit.getDirection() : null);
      return;
    }

    if (serviceUnitId != null) {
      com.example.employeemanagement.model.ServiceUnit serviceUnit = serviceUnitRepository.findById(serviceUnitId)
          .orElseThrow(() -> new ResourceNotFoundException("ServiceUnit not found with id: " + serviceUnitId));
      employee.setServiceUnit(serviceUnit);
      employee.setDivision(null);
      employee.setDirection(serviceUnit.getDirection());
      return;
    }

    if (directionId != null) {
      com.example.employeemanagement.model.Direction direction = directionRepository.findById(directionId)
          .orElseThrow(() -> new ResourceNotFoundException("Direction not found with id: " + directionId));
      employee.setDirection(direction);
      employee.setServiceUnit(null);
      employee.setDivision(null);
      return;
    }

    employee.setDirection(null);
    employee.setServiceUnit(null);
    employee.setDivision(null);
  }
}
