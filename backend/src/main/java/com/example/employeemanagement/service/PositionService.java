package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.PositionDTO;
import com.example.employeemanagement.model.Division;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.model.Position;
import com.example.employeemanagement.repository.DivisionRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.repository.PositionRepository;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PositionService {

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private DivisionRepository divisionRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;

    public List<PositionDTO> getAllPositions() {
        return positionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PositionDTO> getPositionsByDivision(Long divisionId) {
        return positionRepository.findByDivisionId(divisionId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PositionDTO> getPositionsByEmployeeId(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .map(employee -> employee.getPosition() != null ? List.of(employee.getPosition()) : List.<Position>of())
                .orElse(List.of())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PositionDTO createPosition(PositionDTO dto) {
        Position position = new Position();
        updateEntityFromDTO(position, dto);
        Position savedPosition = positionRepository.save(position);
        return toDTO(savedPosition);
    }

    @Transactional
    public PositionDTO updatePosition(Long id, PositionDTO dto) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with id: " + id));
        updateEntityFromDTO(position, dto);
        Position savedPosition = positionRepository.save(position);
        return toDTO(savedPosition);
    }

    @Transactional
    public void deletePosition(Long id) {
        if (!positionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Position not found with id: " + id);
        }
        positionRepository.deleteById(id);
    }
    
    @Transactional
    public PositionDTO assignEmployee(Long positionId, Long employeeId) {
        Position position = positionRepository.findById(positionId)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with id: " + positionId));
        
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        Position previousPosition = employee.getPosition();
        if (previousPosition != null && !previousPosition.getId().equals(position.getId())) {
            previousPosition.setStatus("VACANT");
            positionRepository.save(previousPosition);
        }

        position.setStatus("OCCUPIED");
        employee.setJobTitle(position.getTitle());
        employee.setPosition(position);
        employeeRepository.save(employee);
        
        return toDTO(positionRepository.save(position));
    }
    
    @Transactional
    public PositionDTO releasePosition(Long positionId) {
        Position position = positionRepository.findById(positionId)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with id: " + positionId));
                
        position.setStatus("VACANT");

        employeeRepository.findByPosition_Id(positionId).ifPresent(employee -> {
            employee.setPosition(null);
            employeeRepository.save(employee);
        });
        
        return toDTO(positionRepository.save(position));
    }

    private PositionDTO toDTO(Position position) {
        PositionDTO dto = new PositionDTO();
        dto.setId(position.getId());
        dto.setTitle(position.getTitle());
        if (position.getDivision() != null) {
            dto.setDivisionId(position.getDivision().getId());
            dto.setDivisionName(position.getDivision().getName());
        }
        dto.setCategory(position.getCategory());
        dto.setLevel(position.getLevel());
        dto.setMissions(position.getMissions());
        dto.setDescription(position.getDescription());
        dto.setClassificationLevel(position.getClassificationLevel());
        dto.setStatus(position.getStatus());
        employeeRepository.findByPosition_Id(position.getId()).ifPresent(employee -> {
            dto.setEmployeeId(employee.getId());
            dto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
        });
        return dto;
    }

    private void updateEntityFromDTO(Position position, PositionDTO dto) {
        position.setTitle(dto.getTitle());
        if (dto.getDivisionId() != null) {
            Division division = divisionRepository.findById(dto.getDivisionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Division not found"));
            position.setDivision(division);
        }
        position.setCategory(dto.getCategory());
        position.setLevel(dto.getLevel());
        position.setMissions(dto.getMissions());
        position.setDescription(dto.getDescription());
        position.setClassificationLevel(dto.getClassificationLevel());
        position.setStatus(dto.getStatus());
        
        if (dto.getEmployeeId() != null) {
             Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
             employee.setPosition(position);
             employeeRepository.save(employee);
             position.setStatus("OCCUPIED");
        } else {
             if (position.getStatus() == null) position.setStatus("VACANT");
        }
    }
}
