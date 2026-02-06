package com.example.employeemanagement.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "directions")
public class Direction {
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

    @OneToMany(mappedBy = "direction", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<ServiceUnit> serviceUnits;

    // Manual Constructors
    public Direction() {}
    public Direction(Long id, String name, String description, String address, String managerName, String missions, String objectives, List<ServiceUnit> serviceUnits) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.managerName = managerName;
        this.missions = missions;
        this.objectives = objectives;
        this.serviceUnits = serviceUnits;
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
    public List<ServiceUnit> getServiceUnits() { return serviceUnits; }
    public void setServiceUnits(List<ServiceUnit> serviceUnits) { this.serviceUnits = serviceUnits; }
}
