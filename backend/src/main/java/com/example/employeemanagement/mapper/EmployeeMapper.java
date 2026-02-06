package com.example.employeemanagement.mapper;

import com.example.employeemanagement.dto.EmployeeDTO;
import com.example.employeemanagement.dto.SkillDTO;
import com.example.employeemanagement.dto.PerformanceReviewDTO;
import com.example.employeemanagement.dto.PromotionDTO;
import com.example.employeemanagement.dto.TrainingDTO;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.model.Division;
import com.example.employeemanagement.model.ServiceUnit;
import com.example.employeemanagement.model.Direction;
import com.example.employeemanagement.model.Skill;
import com.example.employeemanagement.model.PerformanceReview;
import com.example.employeemanagement.model.Promotion;
import com.example.employeemanagement.model.Training;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;
import java.util.Collections;
import java.util.List;

@Component
public class EmployeeMapper {

    public EmployeeDTO toDTO(Employee employee) {
        if (employee == null) return null;
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        
        // Calculate age dynamically if DOB is present, otherwise use stored age
        if (employee.getDateOfBirth() != null) {
            dto.setAge(java.time.Period.between(employee.getDateOfBirth(), java.time.LocalDate.now()).getYears());
        } else {
            dto.setAge(employee.getAge());
        }
        
        dto.setGender(employee.getGender());
        
        if (employee.getDivision() != null) {
            Division division = employee.getDivision();
            dto.setDivisionId(division.getId());
            dto.setDivisionName(division.getName());
            
            if (division.getServiceUnit() != null) {
                ServiceUnit service = division.getServiceUnit();
                dto.setServiceUnitId(service.getId());
                dto.setServiceUnitName(service.getName());
                
                if (service.getDirection() != null) {
                    Direction direction = service.getDirection();
                    dto.setDirectionId(direction.getId());
                    dto.setDirectionName(direction.getName());
                }
            }
        }
        
        dto.setDateOfBirth(employee.getDateOfBirth());
        // Mask SSN for display
        dto.setSsn(maskSSN(employee.getSsn()));
        dto.setStreet(employee.getStreet());
        dto.setZipCode(employee.getZipCode());
        dto.setCity(employee.getCity());
        dto.setCountry(employee.getCountry());
        dto.setMobilePhone(employee.getMobilePhone());
        dto.setHomePhone(employee.getHomePhone());
        dto.setEmergencyContact(employee.getEmergencyContact());
        dto.setJobTitle(employee.getJobTitle());
        if (employee.getJobTemplate() != null) {
            dto.setJobTemplateId(employee.getJobTemplate().getId());
            dto.setJobTemplateTitle(employee.getJobTemplate().getTitle());
        }
        if (employee.getPosition() != null) {
            dto.setPositionId(employee.getPosition().getId());
            dto.setPositionTitle(employee.getPosition().getTitle());
        }
        dto.setHireDate(employee.getHireDate());
        dto.setMatricule(employee.getMatricule());
        
        dto.setSkills(employee.getSkills() != null ? 
            employee.getSkills().stream().map(this::toSkillDTO).collect(Collectors.toList()) : Collections.emptyList());
            
        dto.setPerformanceReviews(employee.getPerformanceReviews() != null ? 
            employee.getPerformanceReviews().stream().map(this::toPerformanceReviewDTO).collect(Collectors.toList()) : Collections.emptyList());
            
        dto.setPromotions(employee.getPromotions() != null ? 
            employee.getPromotions().stream().map(this::toPromotionDTO).collect(Collectors.toList()) : Collections.emptyList());
        
        return dto;
    }

    private SkillDTO toSkillDTO(Skill skill) {
        SkillDTO dto = new SkillDTO();
        dto.setId(skill.getId());
        dto.setName(skill.getName());
        dto.setLevel(skill.getLevel());
        dto.setCategory(skill.getCategory());
        return dto;
    }

    public PerformanceReviewDTO toPerformanceReviewDTO(PerformanceReview review) {
        if (review == null) return null;
        PerformanceReviewDTO dto = new PerformanceReviewDTO();
        dto.setId(review.getId());
        dto.setReviewDate(review.getReviewDate());
        dto.setPeriod(review.getPeriod());
        dto.setRating(review.getRating());
        dto.setObjectivesScore(review.getObjectivesScore());
        dto.setSkillsScore(review.getSkillsScore());
        dto.setDisciplineScore(review.getDisciplineScore());
        dto.setProductivityScore(review.getProductivityScore());
        dto.setFinalScore(review.getFinalScore());
        dto.setRecommendation(review.getRecommendation());
        dto.setComments(review.getComments());
        dto.setReviewer(review.getReviewer());
        dto.setObjectivesAchieved(review.getObjectivesAchieved());
        dto.setGeneralAppreciation(review.getGeneralAppreciation());
        dto.setStrengths(review.getStrengths());
        dto.setAreasForImprovement(review.getAreasForImprovement());
        dto.setTrainingPlan(review.getTrainingPlan());
        return dto;
    }

    public PerformanceReview toPerformanceReviewEntity(PerformanceReviewDTO dto) {
        if (dto == null) return null;
        PerformanceReview review = new PerformanceReview();
        review.setId(dto.getId());
        review.setReviewDate(dto.getReviewDate());
        review.setPeriod(dto.getPeriod());
        review.setRating(dto.getRating());
        review.setObjectivesScore(dto.getObjectivesScore());
        review.setSkillsScore(dto.getSkillsScore());
        review.setDisciplineScore(dto.getDisciplineScore());
        review.setProductivityScore(dto.getProductivityScore());
        review.setFinalScore(dto.getFinalScore());
        review.setRecommendation(dto.getRecommendation());
        review.setComments(dto.getComments());
        review.setReviewer(dto.getReviewer());
        review.setObjectivesAchieved(dto.getObjectivesAchieved());
        review.setGeneralAppreciation(dto.getGeneralAppreciation());
        review.setStrengths(dto.getStrengths());
        review.setAreasForImprovement(dto.getAreasForImprovement());
        review.setTrainingPlan(dto.getTrainingPlan());
        return review;
    }

    private PromotionDTO toPromotionDTO(Promotion promotion) {
        PromotionDTO dto = new PromotionDTO();
        dto.setId(promotion.getId());
        dto.setPromotionDate(promotion.getPromotionDate());
        dto.setOldTitle(promotion.getOldTitle());
        dto.setNewTitle(promotion.getNewTitle());
        dto.setReason(promotion.getReason());
        return dto;
    }

    public TrainingDTO toTrainingDTO(Training training) {
        if (training == null) return null;
        TrainingDTO dto = new TrainingDTO();
        dto.setId(training.getId());
        dto.setName(training.getName());
        dto.setStartDate(training.getStartDate());
        dto.setDuration(training.getDuration());
        dto.setInstitution(training.getInstitution());
        return dto;
    }

    public Training toTrainingEntity(TrainingDTO dto) {
        if (dto == null) return null;
        Training training = new Training();
        training.setId(dto.getId());
        training.setName(dto.getName());
        training.setStartDate(dto.getStartDate());
        training.setDuration(dto.getDuration());
        training.setInstitution(dto.getInstitution());
        return training;
    }

    public Employee toEntity(EmployeeDTO dto) {
        if (dto == null) return null;
        Employee employee = new Employee();
        employee.setId(dto.getId());
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setAge(dto.getAge());
        employee.setGender(dto.getGender());
        employee.setGender(dto.getGender());
        
        // Division handling:
        // We will leave Division null here and handle it in Service.
        
        employee.setDateOfBirth(dto.getDateOfBirth());
        // No masking on entity, we save what we get (it will be encrypted by converter)
        employee.setSsn(dto.getSsn()); 
        employee.setStreet(dto.getStreet());
        employee.setZipCode(dto.getZipCode());
        employee.setCity(dto.getCity());
        employee.setCountry(dto.getCountry());
        employee.setMobilePhone(dto.getMobilePhone());
        employee.setHomePhone(dto.getHomePhone());
        employee.setEmergencyContact(dto.getEmergencyContact());
        employee.setJobTitle(dto.getJobTitle());
        employee.setHireDate(dto.getHireDate());
        employee.setMatricule(dto.getMatricule());

        // Administrative Details
        employee.setPublicServiceEntryDate(dto.getPublicServiceEntryDate());
        employee.setCurrentPostEntryDate(dto.getCurrentPostEntryDate());
        employee.setPreviousPosition(dto.getPreviousPosition());
        employee.setAdministrativeStatus(dto.getAdministrativeStatus());
        employee.setStatusCategory(dto.getStatusCategory());
        employee.setHighestDiploma(dto.getHighestDiploma());
        employee.setCurrentAdministrativePosition(dto.getCurrentAdministrativePosition());
        
        return employee;
    }
    
    public void updateEntityFromDTO(EmployeeDTO dto, Employee employee) {
        if (dto == null || employee == null) return;
        
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setAge(dto.getAge());
        
        employee.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getSsn() != null && !dto.getSsn().startsWith("XXX-XX-")) {
             // Only update SSN if it's not the masked version
            employee.setSsn(dto.getSsn());
        }
        employee.setStreet(dto.getStreet());
        employee.setZipCode(dto.getZipCode());
        employee.setCity(dto.getCity());
        employee.setCountry(dto.getCountry());
        employee.setMobilePhone(dto.getMobilePhone());
        employee.setHomePhone(dto.getHomePhone());
        employee.setEmergencyContact(dto.getEmergencyContact());
        employee.setJobTitle(dto.getJobTitle());
        employee.setHireDate(dto.getHireDate());
        employee.setMatricule(dto.getMatricule());

        // Administrative Details
        employee.setPublicServiceEntryDate(dto.getPublicServiceEntryDate());
        employee.setCurrentPostEntryDate(dto.getCurrentPostEntryDate());
        employee.setPreviousPosition(dto.getPreviousPosition());
        employee.setAdministrativeStatus(dto.getAdministrativeStatus());
        employee.setStatusCategory(dto.getStatusCategory());
        employee.setHighestDiploma(dto.getHighestDiploma());
        employee.setCurrentAdministrativePosition(dto.getCurrentAdministrativePosition());
    }

    private String maskSSN(String ssn) {
        if (ssn == null || ssn.length() < 4) return ssn;
        // Simple masking: leave last 4 digits visible
        return "XXX-XX-" + ssn.substring(ssn.length() - 4);
    }
}
