package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;

/** This interface represents a repository for employees. */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

  @Modifying
  @Query("UPDATE Employee e SET e.profilePhoto = :photo, e.photoType = :photoType WHERE e.id = :id")
  void updatePhotoByEmployeeId(Long id, byte[] photo, String photoType);

  /**
   * Find all employees with their divisions.
   *
   * @return List of all employees with their divisions
   */
  @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.division")
  List<Employee> findAllWithDivisions();

  List<Employee> findByDivision_Id(Long divisionId);

  @Query("SELECT MAX(e.updatedAt) FROM Employee e")
  Instant findMaxUpdatedAt();

  Optional<Employee> findByEmail(String email);
  Optional<Employee> findByMatricule(String matricule);
  List<Employee> findAllByMatricule(String matricule);
  
  @Query("SELECT e.matricule FROM Employee e GROUP BY e.matricule HAVING COUNT(e) > 1")
  List<String> findDuplicateMatricules();

  Optional<Employee> findByPosition_Id(Long positionId);

  long countByDirection_Id(Long directionId);
  long countByServiceUnit_Id(Long serviceUnitId);
  long countByDivision_Id(Long divisionId);
  long countByJobTemplate_Id(Long jobTemplateId);

  @Query("SELECT AVG(e.age) FROM Employee e")
  Double findAverageAge();

  @Query("SELECT e.gender, COUNT(e) FROM Employee e GROUP BY e.gender")
  List<Object[]> countByGender();

  @Query(value = "SELECT YEAR(created_at) AS yr, MONTH(created_at) AS mo, COUNT(*) AS cnt FROM employees GROUP BY YEAR(created_at), MONTH(created_at) ORDER BY YEAR(created_at), MONTH(created_at)", nativeQuery = true)
  List<Object[]> countByCreatedMonth();
}
