package com.example.employeemanagement.controller;

import com.example.employeemanagement.model.JobTemplate;
import com.example.employeemanagement.service.JobTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-templates")
@CrossOrigin(origins = "http://localhost:3000")
public class JobTemplateController {

    @Autowired
    private JobTemplateService jobTemplateService;

    @GetMapping
    public List<JobTemplate> getAllJobTemplates() {
        return jobTemplateService.getAllJobTemplates();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobTemplate> getJobTemplateById(@PathVariable Long id) {
        return jobTemplateService.getJobTemplateById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public JobTemplate createJobTemplate(@RequestBody JobTemplate jobTemplate) {
        return jobTemplateService.saveJobTemplate(jobTemplate);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobTemplate> updateJobTemplate(@PathVariable Long id, @RequestBody JobTemplate jobTemplateDetails) {
        return jobTemplateService.getJobTemplateById(id)
                .map(jobTemplate -> {
                    jobTemplate.setTitle(jobTemplateDetails.getTitle());
                    jobTemplate.setDescription(jobTemplateDetails.getDescription());
                    jobTemplate.setDirection(jobTemplateDetails.getDirection());
                    jobTemplate.setServiceUnit(jobTemplateDetails.getServiceUnit());
                    jobTemplate.setDivision(jobTemplateDetails.getDivision());
                    return ResponseEntity.ok(jobTemplateService.saveJobTemplate(jobTemplate));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobTemplate(@PathVariable Long id) {
        if (jobTemplateService.getJobTemplateById(id).isPresent()) {
            jobTemplateService.deleteJobTemplate(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/direction/{id}")
    public List<JobTemplate> getByDirection(@PathVariable Long id) {
        return jobTemplateService.getJobTemplatesByDirection(id);
    }

    @GetMapping("/service/{id}")
    public List<JobTemplate> getByServiceUnit(@PathVariable Long id) {
        return jobTemplateService.getJobTemplatesByServiceUnit(id);
    }

    @GetMapping("/division/{id}")
    public List<JobTemplate> getByDivision(@PathVariable Long id) {
        return jobTemplateService.getJobTemplatesByDivision(id);
    }
}
