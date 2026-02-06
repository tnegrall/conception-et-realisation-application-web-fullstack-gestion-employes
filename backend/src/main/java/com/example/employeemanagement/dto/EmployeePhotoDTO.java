package com.example.employeemanagement.dto;

import lombok.Data;

@Data
public class EmployeePhotoDTO {
    private Long employeeId;
    private String base64Image;
    private String contentType;

    // Manual Getters and Setters
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getBase64Image() { return base64Image; }
    public void setBase64Image(String base64Image) { this.base64Image = base64Image; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
}
