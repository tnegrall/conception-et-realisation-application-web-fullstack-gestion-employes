package com.example.employeemanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import com.example.employeemanagement.util.AttributeEncryptor;

/**
 * This class represents an Employee entity. Each employee has an ID, first name, last name, email,
 * department, and age.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employees", indexes = {
    @Index(name = "idx_employee_division", columnList = "division_id")
})
@EntityListeners(AuditingEntityListener.class)
public class Employee {

  /** The ID of the employee. It is unique and generated automatically. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** The first name of the employee. */
  private String firstName;

  /** The last name of the employee. */
  private String lastName;

  /** The email of the employee. */
  @Column(unique = true)
  private String email;

  @Column(name = "gender", nullable = false)
  private String gender;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "direction_id")
  private Direction direction;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "service_unit_id")
  private ServiceUnit serviceUnit;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "division_id")
  @JsonBackReference
  private Division division;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "job_template_id")
  private JobTemplate jobTemplate;

  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "position_id")
  @JsonIgnoreProperties({"employee"})
  private Position position;

  @OneToOne
  @JoinColumn(name = "user_id")
  private User user;

  /** The age of the employee. */
  private int age;

  // New Fields
  
  @Column(name = "date_of_birth")
  private LocalDate dateOfBirth;

  @Convert(converter = AttributeEncryptor.class)
  @Column(name = "ssn")
  private String ssn;

  private String street;
  
  @Column(name = "zip_code")
  private String zipCode;
  
  private String city;
  private String country;
  
  @Column(name = "mobile_phone")
  private String mobilePhone;

  @Column(name = "home_phone")
  private String homePhone;

  @Column(name = "emergency_contact")
  private String emergencyContact;
  
  @Column(name = "job_title")
  private String jobTitle;
  
  @Column(name = "hire_date")
  private LocalDate hireDate;
  
  @Column(unique = true)
  private String matricule;
  
  // Administrative Details
  @Column(name = "public_service_entry_date")
  private LocalDate publicServiceEntryDate;
  
  @Column(name = "current_post_entry_date")
  private LocalDate currentPostEntryDate;
  
  @Column(name = "previous_position")
  private String previousPosition;
  
  @Column(name = "administrative_status")
  private String administrativeStatus;
  
  @Column(name = "status_category")
  private String statusCategory;
  
  @Column(name = "highest_diploma")
  private String highestDiploma;
  
  @Column(name = "current_administrative_position")
  private String currentAdministrativePosition;

  @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JsonManagedReference
  private List<Skill> skills;

  @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JsonManagedReference
  private List<Training> trainings;

  @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JsonManagedReference
  private List<PerformanceReview> performanceReviews;

  @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JsonManagedReference
  private List<Promotion> promotions;

  @Lob
  @Column(columnDefinition = "LONGBLOB")
  private byte[] profilePhoto;

  @Column(name = "photo_type")
  private String photoType;

  @CreatedDate
  @Column(name = "created_at", updatable = false)
  private Instant createdAt;

  @LastModifiedDate
  @Column(name = "updated_at")
  private Instant updatedAt;

  // Manual Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }
  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getGender() { return gender; }
  public void setGender(String gender) { this.gender = gender; }
  public Division getDivision() { return division; }
  public void setDivision(Division division) { this.division = division; }
  public int getAge() { return age; }
  public void setAge(int age) { this.age = age; }
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
  public LocalDate getHireDate() { return hireDate; }
  public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }
  public Position getPosition() { return position; }
  public void setPosition(Position position) { this.position = position; }
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
  public List<Skill> getSkills() { return skills; }
  public void setSkills(List<Skill> skills) { this.skills = skills; }
  public List<Training> getTrainings() { return trainings; }
  public void setTrainings(List<Training> trainings) { this.trainings = trainings; }
  public List<PerformanceReview> getPerformanceReviews() { return performanceReviews; }
  public void setPerformanceReviews(List<PerformanceReview> performanceReviews) { this.performanceReviews = performanceReviews; }
  public List<Promotion> getPromotions() { return promotions; }
  public void setPromotions(List<Promotion> promotions) { this.promotions = promotions; }
  public byte[] getProfilePhoto() { return profilePhoto; }
  public void setProfilePhoto(byte[] profilePhoto) { this.profilePhoto = profilePhoto; }
  public String getPhotoType() { return photoType; }
  public void setPhotoType(String photoType) { this.photoType = photoType; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
