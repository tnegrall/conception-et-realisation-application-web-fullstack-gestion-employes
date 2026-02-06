package com.example.employeemanagement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ContractDTO {
    private Long id;
    private Long employeeId;
    private String type;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate probationEndDate;
    private String status;
    private String grade;
    private String salaryLevel;

    // Manual Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public LocalDate getProbationEndDate() { return probationEndDate; }
    public void setProbationEndDate(LocalDate probationEndDate) { this.probationEndDate = probationEndDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public String getSalaryLevel() { return salaryLevel; }
    public void setSalaryLevel(String salaryLevel) { this.salaryLevel = salaryLevel; }
}
