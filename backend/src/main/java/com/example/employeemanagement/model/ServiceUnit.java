package com.example.employeemanagement.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "service_units")
public class ServiceUnit {
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
    @JoinColumn(name = "direction_id")
    @JsonBackReference
    private Direction direction;

    @OneToMany(mappedBy = "serviceUnit", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Division> divisions;

    // Manual Constructors
    public ServiceUnit() {}
    public ServiceUnit(Long id, String name, String description, String address, String managerName, String missions, String objectives, Direction direction, List<Division> divisions) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.managerName = managerName;
        this.missions = missions;
        this.objectives = objectives;
        this.direction = direction;
        this.divisions = divisions;
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
    public Direction getDirection() { return direction; }
    public void setDirection(Direction direction) { this.direction = direction; }
    public List<Division> getDivisions() { return divisions; }
    public void setDivisions(List<Division> divisions) { this.divisions = divisions; }
}
