package com.example.employeemanagement.dto;

import lombok.Data;

@Data
public class SkillDTO {
    private Long id;
    private String name;
    private String level;
    private String category;

    // Manual Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
