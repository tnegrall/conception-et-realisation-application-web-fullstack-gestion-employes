package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.JobTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobTemplateRepository extends JpaRepository<JobTemplate, Long> {
    List<JobTemplate> findByDirectionId(Long directionId);
    List<JobTemplate> findByServiceUnitId(Long serviceUnitId);
    List<JobTemplate> findByDivisionId(Long divisionId);
}
