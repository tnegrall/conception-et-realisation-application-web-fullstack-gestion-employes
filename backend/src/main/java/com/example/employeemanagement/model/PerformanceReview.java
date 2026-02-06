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
@Table(name = "performance_reviews")
public class PerformanceReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "review_date")
    private LocalDate reviewDate;

    private String period; // e.g. 2024, S1-2025

    private String rating; // e.g., 1-5 or "Excellent", etc.

    @Column(name = "objectives_score")
    private Integer objectivesScore;
    
    @Column(name = "skills_score")
    private Integer skillsScore;
    
    @Column(name = "discipline_score")
    private Integer disciplineScore;
    
    @Column(name = "productivity_score")
    private Integer productivityScore;
    
    @Column(name = "final_score")
    private Double finalScore;
    
    private String recommendation;

    private String comments;
    private String reviewer;
    
    @Column(name = "objectives_achieved")
    private String objectivesAchieved;
    
    @Column(name = "general_appreciation")
    private String generalAppreciation;
    
    @Column(columnDefinition = "TEXT")
    private String strengths;
    
    @Column(name = "areas_for_improvement", columnDefinition = "TEXT")
    private String areasForImprovement;
    
    @Column(name = "training_plan", columnDefinition = "TEXT")
    private String trainingPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonBackReference
    private Employee employee;

    // Manual getters and setters to ensure compilation
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDate reviewDate) { this.reviewDate = reviewDate; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }
    public Integer getObjectivesScore() { return objectivesScore; }
    public void setObjectivesScore(Integer objectivesScore) { this.objectivesScore = objectivesScore; }
    public Integer getSkillsScore() { return skillsScore; }
    public void setSkillsScore(Integer skillsScore) { this.skillsScore = skillsScore; }
    public Integer getDisciplineScore() { return disciplineScore; }
    public void setDisciplineScore(Integer disciplineScore) { this.disciplineScore = disciplineScore; }
    public Integer getProductivityScore() { return productivityScore; }
    public void setProductivityScore(Integer productivityScore) { this.productivityScore = productivityScore; }
    public Double getFinalScore() { return finalScore; }
    public void setFinalScore(Double finalScore) { this.finalScore = finalScore; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public String getReviewer() { return reviewer; }
    public void setReviewer(String reviewer) { this.reviewer = reviewer; }
    public String getObjectivesAchieved() { return objectivesAchieved; }
    public void setObjectivesAchieved(String objectivesAchieved) { this.objectivesAchieved = objectivesAchieved; }
    public String getGeneralAppreciation() { return generalAppreciation; }
    public void setGeneralAppreciation(String generalAppreciation) { this.generalAppreciation = generalAppreciation; }
    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }
    public String getAreasForImprovement() { return areasForImprovement; }
    public void setAreasForImprovement(String areasForImprovement) { this.areasForImprovement = areasForImprovement; }
    public String getTrainingPlan() { return trainingPlan; }
    public void setTrainingPlan(String trainingPlan) { this.trainingPlan = trainingPlan; }
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
}
