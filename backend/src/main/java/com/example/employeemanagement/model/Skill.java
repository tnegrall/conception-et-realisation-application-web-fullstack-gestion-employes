package com.example.employeemanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "skills")
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String level; // e.g., Beginner, Intermediate, Expert
    private String category; // e.g., TECHNICAL, LANGUAGE, TOOL

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonBackReference
    private Employee employee;

    // Manual Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
}
