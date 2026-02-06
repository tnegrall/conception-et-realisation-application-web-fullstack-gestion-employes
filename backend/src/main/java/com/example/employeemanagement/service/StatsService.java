package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.DashboardStatsDTO;
import com.example.employeemanagement.dto.MonthlyCountDTO;
import com.example.employeemanagement.model.Division;
import com.example.employeemanagement.repository.DivisionRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatsService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DivisionRepository divisionRepository;

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO dto = new DashboardStatsDTO();

        long totalEmployees = employeeRepository.count();
        dto.setTotalEmployees(totalEmployees);

        Double avgAge = employeeRepository.findAverageAge();
        dto.setAverageAge(avgAge != null ? Math.round(avgAge * 100.0) / 100.0 : 0.0);

        long orgCount = divisionRepository.count();
        dto.setTotalOrganizations(orgCount);
        dto.setAverageTeamSize(orgCount > 0 ? Math.round((totalEmployees * 100.0) / orgCount) / 100.0 : 0.0);

        Map<String, Long> employeesByOrg = new LinkedHashMap<>();
        List<Division> divisions = divisionRepository.findAll();
        for (Division division : divisions) {
            long count = employeeRepository.countByDivision_Id(division.getId());
            employeesByOrg.put(division.getName(), count);
        }
        dto.setEmployeesByOrganization(employeesByOrg);

        List<Object[]> growthRows = employeeRepository.countByCreatedMonth();
        List<MonthlyCountDTO> growthList = growthRows.stream()
                .map(row -> {
                    int year = ((Number) row[0]).intValue();
                    int month = ((Number) row[1]).intValue();
                    long count = ((Number) row[2]).longValue();
                    String label = String.format("%04d-%02d", year, month);
                    return new MonthlyCountDTO(label, count);
                })
                .collect(Collectors.toList());
        dto.setGrowthByMonth(growthList);

        long male = 0;
        long female = 0;
        long other = 0;
        List<Object[]> genderRows = employeeRepository.countByGender();
        for (Object[] row : genderRows) {
            String gender = row[0] != null ? row[0].toString() : "";
            long count = ((Number) row[1]).longValue();
            if ("M".equalsIgnoreCase(gender) || "H".equalsIgnoreCase(gender) || "HOMME".equalsIgnoreCase(gender)) {
                male += count;
            } else if ("F".equalsIgnoreCase(gender) || "FEMME".equalsIgnoreCase(gender)) {
                female += count;
            } else {
                other += count;
            }
        }

        dto.setMaleCount(male);
        dto.setFemaleCount(female);
        dto.setOtherCount(other);

        return dto;
    }
}
