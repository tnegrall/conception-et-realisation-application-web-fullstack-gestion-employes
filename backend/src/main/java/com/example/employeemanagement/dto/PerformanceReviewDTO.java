package com.example.employeemanagement.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PerformanceReviewDTO {
    private Long id;
    private LocalDate reviewDate;
    private String period;
    private String rating;
    private Integer objectivesScore;
    private Integer skillsScore;
    private Integer disciplineScore;
    private Integer productivityScore;
    private Double finalScore;
    private String recommendation;
    private String comments;
    private String reviewer;
    
    private String objectivesAchieved;
    private String generalAppreciation;
    private String strengths;
    private String areasForImprovement;
    private String trainingPlan;

    // Manual Getters and Setters
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
}
