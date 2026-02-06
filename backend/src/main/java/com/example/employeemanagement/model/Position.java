package com.example.employeemanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import java.time.Instant;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "positions")
@EntityListeners(AuditingEntityListener.class)
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "division_id")
    @JsonIgnoreProperties("employees")
    private Division division;

    private String category; // A, B, C
    private String level; // Junior, Senior...

    @Column(columnDefinition = "TEXT")
    private String missions;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "classification_level")
    private String classificationLevel;

    @Column(nullable = false)
    private String status; // VACANT, OCCUPIED

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;

    // Manual Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Division getDivision() { return division; }
    public void setDivision(Division division) { this.division = division; }
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
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
