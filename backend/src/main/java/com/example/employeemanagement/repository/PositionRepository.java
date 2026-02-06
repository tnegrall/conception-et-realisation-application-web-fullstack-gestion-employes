package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByDivisionId(Long divisionId);
    List<Position> findByStatus(String status);
}
