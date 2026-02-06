package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.EmployeeActionDTO;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.model.EmployeeAction;
import com.example.employeemanagement.repository.EmployeeActionRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeActionService {
    @Autowired
    private EmployeeActionRepository employeeActionRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional
    public void logAction(Employee employee, String actionType, String actor, String details) {
        EmployeeAction action = new EmployeeAction();
        action.setEmployee(employee);
        action.setActionType(actionType);
        action.setActor(resolveActor(actor));
        action.setDetails(details);
        employeeActionRepository.save(action);
    }

    @Transactional(readOnly = true)
    public List<EmployeeActionDTO> getActionsForEmployee(Long employeeId) {
        employeeRepository.findById(employeeId).orElseThrow(() -> new com.example.employeemanagement.exception.ResourceNotFoundException("Employé introuvable avec l'identifiant : " + employeeId));
        return employeeActionRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private EmployeeActionDTO toDTO(EmployeeAction action) {
        EmployeeActionDTO dto = new EmployeeActionDTO();
        dto.setId(action.getId());
        dto.setActionType(action.getActionType());
        dto.setActor(action.getActor());
        dto.setDetails(action.getDetails());
        dto.setActionAt(action.getCreatedAt());
        return dto;
    }

    private String resolveActor(String actor) {
        if (actor == null || actor.isBlank()) {
            return "RH";
        }
        return actor;
    }
}
