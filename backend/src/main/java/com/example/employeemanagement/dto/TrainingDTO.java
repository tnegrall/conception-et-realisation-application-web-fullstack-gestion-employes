package com.example.employeemanagement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TrainingDTO {
    private Long id;
    private String name;
    private LocalDate startDate;
    private String duration;
    private String institution;

    // Manual Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
}
