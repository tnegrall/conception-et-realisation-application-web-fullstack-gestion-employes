package com.example.employeemanagement.service;

import com.example.employeemanagement.model.Direction;
import com.example.employeemanagement.model.Division;
import com.example.employeemanagement.model.ServiceUnit;
import com.example.employeemanagement.repository.DirectionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrganizationServiceTest {

    @Mock
    private DirectionRepository directionRepository;

    @InjectMocks
    private OrganizationService organizationService;

    @Test
    void getOrganizationStructure_ShouldReturnHierarchy_WhenDataExists() {
        // Arrange
        Division div1 = new Division();
        div1.setId(10L);
        div1.setName("Division A");

        ServiceUnit service1 = new ServiceUnit();
        service1.setId(5L);
        service1.setName("Service 1");
        service1.setDivisions(Collections.singletonList(div1));

        Direction dir1 = new Direction();
        dir1.setId(1L);
        dir1.setName("Direction Generale");
        dir1.setServiceUnits(Collections.singletonList(service1));

        when(directionRepository.findAll()).thenReturn(Collections.singletonList(dir1));

        // Act
        List<Direction> result = organizationService.getOrganizationStructure();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        
        Direction dirResult = result.get(0);
        assertEquals("Direction Generale", dirResult.getName());
        assertEquals(1, dirResult.getServiceUnits().size());

        ServiceUnit serviceResult = dirResult.getServiceUnits().get(0);
        assertEquals("Service 1", serviceResult.getName());
        assertEquals(1, serviceResult.getDivisions().size());

        Division divResult = serviceResult.getDivisions().get(0);
        assertEquals("Division A", divResult.getName());
    }

    @Test
    void getOrganizationStructure_ShouldReturnEmptyList_WhenNoData() {
        // Arrange
        when(directionRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        List<Direction> result = organizationService.getOrganizationStructure();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}
