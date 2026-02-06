package com.example.employeemanagement.service;

import com.example.employeemanagement.model.JobTemplate;
import com.example.employeemanagement.repository.JobTemplateRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobTemplateService {

    @Autowired
    private JobTemplateRepository jobTemplateRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<JobTemplate> getAllJobTemplates() {
        return jobTemplateRepository.findAll();
    }

    public Optional<JobTemplate> getJobTemplateById(Long id) {
        return jobTemplateRepository.findById(id);
    }

    public JobTemplate saveJobTemplate(JobTemplate jobTemplate) {
        return jobTemplateRepository.save(jobTemplate);
    }

    public void deleteJobTemplate(Long id) {
        long count = employeeRepository.countByJobTemplate_Id(id);
        if (count > 0) {
            throw new IllegalStateException("Impossible de supprimer ce poste type car il est assigné à " + count + " employé(s).");
        }
        jobTemplateRepository.deleteById(id);
    }

    public List<JobTemplate> getJobTemplatesByDirection(Long directionId) {
        return jobTemplateRepository.findByDirectionId(directionId);
    }

    public List<JobTemplate> getJobTemplatesByServiceUnit(Long serviceUnitId) {
        return jobTemplateRepository.findByServiceUnitId(serviceUnitId);
    }

    public List<JobTemplate> getJobTemplatesByDivision(Long divisionId) {
        return jobTemplateRepository.findByDivisionId(divisionId);
    }
}
