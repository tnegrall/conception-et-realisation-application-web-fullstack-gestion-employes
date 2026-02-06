package com.example.employeemanagement.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private long totalEmployees;
    private Double averageAge;
    private long totalOrganizations;
    private Double averageTeamSize;
    private Map<String, Long> employeesByOrganization;
    private List<MonthlyCountDTO> growthByMonth;
    private Long maleCount;
    private Long femaleCount;
    private Long otherCount;

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }
    public Double getAverageAge() { return averageAge; }
    public void setAverageAge(Double averageAge) { this.averageAge = averageAge; }
    public long getTotalOrganizations() { return totalOrganizations; }
    public void setTotalOrganizations(long totalOrganizations) { this.totalOrganizations = totalOrganizations; }
    public Double getAverageTeamSize() { return averageTeamSize; }
    public void setAverageTeamSize(Double averageTeamSize) { this.averageTeamSize = averageTeamSize; }
    public Map<String, Long> getEmployeesByOrganization() { return employeesByOrganization; }
    public void setEmployeesByOrganization(Map<String, Long> employeesByOrganization) { this.employeesByOrganization = employeesByOrganization; }
    public List<MonthlyCountDTO> getGrowthByMonth() { return growthByMonth; }
    public void setGrowthByMonth(List<MonthlyCountDTO> growthByMonth) { this.growthByMonth = growthByMonth; }
    public Long getMaleCount() { return maleCount; }
    public void setMaleCount(Long maleCount) { this.maleCount = maleCount; }
    public Long getFemaleCount() { return femaleCount; }
    public void setFemaleCount(Long femaleCount) { this.femaleCount = femaleCount; }
    public Long getOtherCount() { return otherCount; }
    public void setOtherCount(Long otherCount) { this.otherCount = otherCount; }
}
