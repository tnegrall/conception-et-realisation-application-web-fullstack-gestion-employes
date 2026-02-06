package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.Direction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DirectionRepository extends JpaRepository<Direction, Long> {
}
