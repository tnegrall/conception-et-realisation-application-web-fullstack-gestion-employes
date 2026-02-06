package com.example.employeemanagement.dto;

import lombok.Data;

@Data
public class PositionDTO {
    private Long id;
    private String title;
    private Long divisionId;
    private String divisionName;
    private String category;
    private String level;
    private String missions;
    private String description;
    private String classificationLevel;
    private String status;
    private Long employeeId;
    private String employeeName;

    // Manual Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Long getDivisionId() { return divisionId; }
    public void setDivisionId(Long divisionId) { this.divisionId = divisionId; }
    public String getDivisionName() { return divisionName; }
    public void setDivisionName(String divisionName) { this.divisionName = divisionName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getMissions() { return missions; }
    public void setMissions(String missions) { this.missions = missions; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getClassificationLevel() { return classificationLevel; }
    public void setClassificationLevel(String classificationLevel) { this.classificationLevel = classificationLevel; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
}
