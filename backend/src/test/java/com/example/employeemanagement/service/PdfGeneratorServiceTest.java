package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.EmployeeActionDTO;
import com.example.employeemanagement.dto.EmployeeDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.IContext;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PdfGeneratorServiceTest {

    @Mock
    private ITemplateEngine templateEngine;

    private PdfGeneratorService pdfGeneratorService;

    private EmployeeDTO employeeDTO;
    private List<EmployeeActionDTO> history;

    @BeforeEach
    void setUp() {
        pdfGeneratorService = new PdfGeneratorService(templateEngine);
        
        employeeDTO = new EmployeeDTO();
        employeeDTO.setFirstName("John");
        employeeDTO.setLastName("Doe");
        employeeDTO.setMatricule("M12345");
        
        history = new ArrayList<>();
        EmployeeActionDTO action = new EmployeeActionDTO();
        action.setActionType("HIRE");
        history.add(action);
    }

    @Test
    void generateEmployeePdf_ShouldReturnByteArray_WhenDataIsValid() {
        // Arrange
        String mockHtml = "<html><body><h1>Test PDF</h1></body></html>";
        when(templateEngine.process(eq("employee-pdf"), any(IContext.class))).thenReturn(mockHtml);

        // Act
        byte[] result = pdfGeneratorService.generateEmployeePdf(employeeDTO, history, null);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);
    }
    
    @Test
    void generateEmployeePdf_ShouldHandlePhotoBase64() {
        // Arrange
        String mockHtml = "<html><body><h1>Test PDF with Photo</h1></body></html>";
        when(templateEngine.process(eq("employee-pdf"), any(IContext.class))).thenReturn(mockHtml);
        String photoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

        // Act
        byte[] result = pdfGeneratorService.generateEmployeePdf(employeeDTO, history, photoBase64);

        // Assert
        assertNotNull(result);
        assertTrue(result.length > 0);
    }
}
