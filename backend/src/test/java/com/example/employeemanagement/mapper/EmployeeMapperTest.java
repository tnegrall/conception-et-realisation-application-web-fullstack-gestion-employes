package com.example.employeemanagement.mapper;

import com.example.employeemanagement.dto.EmployeeDTO;
import com.example.employeemanagement.model.Employee;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EmployeeMapperTest {

    private final EmployeeMapper employeeMapper = new EmployeeMapper();

    @Test
    void toDTO_ShouldCalculateAge_WhenDateOfBirthIsPresent() {
        // Arrange
        Employee employee = new Employee();
        employee.setId(1L);
        LocalDate dob = LocalDate.now().minusYears(30);
        employee.setDateOfBirth(dob);
        employee.setAge(0); // Set wrong age to verify calculation

        // Act
        EmployeeDTO dto = employeeMapper.toDTO(employee);

        // Assert
        assertEquals(30, dto.getAge());
    }

    @Test
    void toDTO_ShouldUseStoredAge_WhenDateOfBirthIsMissing() {
        // Arrange
        Employee employee = new Employee();
        employee.setId(1L);
        employee.setDateOfBirth(null);
        employee.setAge(25);

        // Act
        EmployeeDTO dto = employeeMapper.toDTO(employee);

        // Assert
        assertEquals(25, dto.getAge());
    }
}
