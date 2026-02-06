package com.example.employeemanagement.dto;

import lombok.Data;
import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Data
public class EmployeeDTO {
    private Long id;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @Email
    @NotBlank
    private String email;
    @Min(0)
    private int age;
    @NotBlank
    private String gender;

    @NotNull
    private Long divisionId;
    private String divisionName;
    @NotNull
    private Long serviceUnitId;
    private String serviceUnitName;
    @NotNull
    private Long directionId;
    private String directionName;
    
    @NotNull
    private LocalDate dateOfBirth;
    private String ssn;
    private String street;
    private String zipCode;
    private String city;
    private String country;
    private String mobilePhone;
    private String homePhone;
    private String emergencyContact;
    @NotBlank
    private String jobTitle;
    private Long jobTemplateId;
    private String jobTemplateTitle;
    private Long positionId;
    private String positionTitle;
    @NotNull
    private LocalDate hireDate;
    private String matricule;

    // Administrative Details
    private LocalDate publicServiceEntryDate;
    private LocalDate currentPostEntryDate;
    private String previousPosition;
    private String administrativeStatus;
    private String statusCategory;
    private String highestDiploma;
    private String currentAdministrativePosition;
    
    private List<SkillDTO> skills;
    private List<TrainingDTO> trainings;
    private List<PerformanceReviewDTO> performanceReviews;
    private List<PromotionDTO> promotions;

    // Manual Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public Long getDivisionId() { return divisionId; }
    public void setDivisionId(Long divisionId) { this.divisionId = divisionId; }
    public String getDivisionName() { return divisionName; }
    public void setDivisionName(String divisionName) { this.divisionName = divisionName; }
    public Long getServiceUnitId() { return serviceUnitId; }
    public void setServiceUnitId(Long serviceUnitId) { this.serviceUnitId = serviceUnitId; }
    public String getServiceUnitName() { return serviceUnitName; }
    public void setServiceUnitName(String serviceUnitName) { this.serviceUnitName = serviceUnitName; }
    public Long getDirectionId() { return directionId; }
    public void setDirectionId(Long directionId) { this.directionId = directionId; }
    public String getDirectionName() { return directionName; }
    public void setDirectionName(String directionName) { this.directionName = directionName; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getSsn() { return ssn; }
    public void setSsn(String ssn) { this.ssn = ssn; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getMobilePhone() { return mobilePhone; }
    public void setMobilePhone(String mobilePhone) { this.mobilePhone = mobilePhone; }
    public String getHomePhone() { return homePhone; }
    public void setHomePhone(String homePhone) { this.homePhone = homePhone; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public Long getJobTemplateId() { return jobTemplateId; }
    public void setJobTemplateId(Long jobTemplateId) { this.jobTemplateId = jobTemplateId; }
    public String getJobTemplateTitle() { return jobTemplateTitle; }
    public void setJobTemplateTitle(String jobTemplateTitle) { this.jobTemplateTitle = jobTemplateTitle; }
    public Long getPositionId() { return positionId; }
    public void setPositionId(Long positionId) { this.positionId = positionId; }
    public String getPositionTitle() { return positionTitle; }
    public void setPositionTitle(String positionTitle) { this.positionTitle = positionTitle; }
    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }
    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }
    public LocalDate getPublicServiceEntryDate() { return publicServiceEntryDate; }
    public void setPublicServiceEntryDate(LocalDate publicServiceEntryDate) { this.publicServiceEntryDate = publicServiceEntryDate; }
    public LocalDate getCurrentPostEntryDate() { return currentPostEntryDate; }
    public void setCurrentPostEntryDate(LocalDate currentPostEntryDate) { this.currentPostEntryDate = currentPostEntryDate; }
    public String getPreviousPosition() { return previousPosition; }
    public void setPreviousPosition(String previousPosition) { this.previousPosition = previousPosition; }
    public String getAdministrativeStatus() { return administrativeStatus; }
    public void setAdministrativeStatus(String administrativeStatus) { this.administrativeStatus = administrativeStatus; }
    public String getStatusCategory() { return statusCategory; }
    public void setStatusCategory(String statusCategory) { this.statusCategory = statusCategory; }
    public String getHighestDiploma() { return highestDiploma; }
    public void setHighestDiploma(String highestDiploma) { this.highestDiploma = highestDiploma; }
    public String getCurrentAdministrativePosition() { return currentAdministrativePosition; }
    public void setCurrentAdministrativePosition(String currentAdministrativePosition) { this.currentAdministrativePosition = currentAdministrativePosition; }
    public List<SkillDTO> getSkills() { return skills; }
    public void setSkills(List<SkillDTO> skills) { this.skills = skills; }
    public List<TrainingDTO> getTrainings() { return trainings; }
    public void setTrainings(List<TrainingDTO> trainings) { this.trainings = trainings; }
    public List<PerformanceReviewDTO> getPerformanceReviews() { return performanceReviews; }
    public void setPerformanceReviews(List<PerformanceReviewDTO> performanceReviews) { this.performanceReviews = performanceReviews; }
    public List<PromotionDTO> getPromotions() { return promotions; }
    public void setPromotions(List<PromotionDTO> promotions) { this.promotions = promotions; }
}
