package com.example.employeemanagement.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class DocumentDTO {
    private Long id;
    private Long employeeId;
    private String title;
    private String type;
    private String fileName;
    private String contentType;
    private String downloadUrl;
    private Instant uploadedAt;

    // Manual Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }
}
