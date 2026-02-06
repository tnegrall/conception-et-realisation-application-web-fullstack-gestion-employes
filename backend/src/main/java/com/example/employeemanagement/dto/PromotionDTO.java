package com.example.employeemanagement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PromotionDTO {
    private Long id;
    private LocalDate promotionDate;
    private String oldTitle;
    private String newTitle;
    private String reason;

    // Manual Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getPromotionDate() { return promotionDate; }
    public void setPromotionDate(LocalDate promotionDate) { this.promotionDate = promotionDate; }
    public String getOldTitle() { return oldTitle; }
    public void setOldTitle(String oldTitle) { this.oldTitle = oldTitle; }
    public String getNewTitle() { return newTitle; }
    public void setNewTitle(String newTitle) { this.newTitle = newTitle; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
