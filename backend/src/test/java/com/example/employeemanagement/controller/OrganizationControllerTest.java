package com.example.employeemanagement.controller;

import com.example.employeemanagement.model.Direction;
import com.example.employeemanagement.model.Division;
import com.example.employeemanagement.model.ServiceUnit;
import com.example.employeemanagement.service.OrganizationService;
import com.example.employeemanagement.security.JwtTokenUtil;
import com.example.employeemanagement.security.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrganizationController.class)
@AutoConfigureMockMvc(addFilters = false)
class OrganizationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrganizationService organizationService;

    @MockBean
    private JwtTokenUtil jwtTokenUtil;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private JpaMetamodelMappingContext jpaMetamodelMappingContext;

    @Test
    void createDirection_ShouldReturnCreatedDirection() throws Exception {
        Direction direction = new Direction();
        direction.setName("IT Direction");
        direction.setAddress("123 Tech Lane");
        direction.setManagerName("John Doe");

        when(organizationService.createDirection(any(Direction.class))).thenReturn(direction);

        mockMvc.perform(post("/api/organization/directions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(direction)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("IT Direction"))
                .andExpect(jsonPath("$.address").value("123 Tech Lane"))
                .andExpect(jsonPath("$.managerName").value("John Doe"));
    }

    @Test
    void createServiceUnit_ShouldReturnCreatedService() throws Exception {
        ServiceUnit serviceUnit = new ServiceUnit();
        serviceUnit.setName("Development Service");
        serviceUnit.setAddress("456 Dev Blvd");
        serviceUnit.setManagerName("Jane Smith");
        Long directionId = 1L;

        when(organizationService.createServiceUnit(eq(directionId), any(ServiceUnit.class))).thenReturn(serviceUnit);

        mockMvc.perform(post("/api/organization/services")
                .param("directionId", String.valueOf(directionId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(serviceUnit)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Development Service"))
                .andExpect(jsonPath("$.address").value("456 Dev Blvd"))
                .andExpect(jsonPath("$.managerName").value("Jane Smith"));
    }

    @Test
    void createDivision_ShouldReturnCreatedDivision() throws Exception {
        Division division = new Division();
        division.setName("Backend Division");
        division.setAddress("789 Java St");
        division.setManagerName("Bob Java");
        Long serviceId = 2L;

        when(organizationService.createDivision(eq(serviceId), any(Division.class))).thenReturn(division);

        mockMvc.perform(post("/api/organization/divisions")
                .param("serviceId", String.valueOf(serviceId))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(division)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Backend Division"))
                .andExpect(jsonPath("$.address").value("789 Java St"))
                .andExpect(jsonPath("$.managerName").value("Bob Java"));
    }
}
