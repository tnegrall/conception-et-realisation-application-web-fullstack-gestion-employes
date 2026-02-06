package com.example.employeemanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "promotions")
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "promotion_date")
    private LocalDate promotionDate;

    @Column(name = "old_title")
    private String oldTitle;

    @Column(name = "new_title")
    private String newTitle;

    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonBackReference
    private Employee employee;

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
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
}
