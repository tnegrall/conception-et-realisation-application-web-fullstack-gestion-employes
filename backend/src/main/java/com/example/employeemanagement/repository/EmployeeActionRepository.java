package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.EmployeeAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeActionRepository extends JpaRepository<EmployeeAction, Long> {
    List<EmployeeAction> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
}
