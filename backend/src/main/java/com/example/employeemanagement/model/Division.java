package com.example.employeemanagement.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "divisions")
public class Division {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String address;
    private String managerName;
    
    @Column(columnDefinition = "TEXT")
    private String missions;
    
    @Column(columnDefinition = "TEXT")
    private String objectives;

    @ManyToOne
    @JoinColumn(name = "service_unit_id")
    @JsonBackReference
    private ServiceUnit serviceUnit;

    // Manual Constructors
    public Division() {}
    public Division(Long id, String name, String description, String address, String managerName, String missions, String objectives, ServiceUnit serviceUnit) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.managerName = managerName;
        this.missions = missions;
        this.objectives = objectives;
        this.serviceUnit = serviceUnit;
    }

    // Manual Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }
    public String getMissions() { return missions; }
    public void setMissions(String missions) { this.missions = missions; }
    public String getObjectives() { return objectives; }
    public void setObjectives(String objectives) { this.objectives = objectives; }
    public ServiceUnit getServiceUnit() { return serviceUnit; }
    public void setServiceUnit(ServiceUnit serviceUnit) { this.serviceUnit = serviceUnit; }
}
