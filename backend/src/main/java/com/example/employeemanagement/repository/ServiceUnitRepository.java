package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.ServiceUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceUnitRepository extends JpaRepository<ServiceUnit, Long> {
}
