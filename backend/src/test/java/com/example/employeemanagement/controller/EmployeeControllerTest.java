package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.EmployeePhotoDTO;
import com.example.employeemanagement.service.EmployeeService;
import com.example.employeemanagement.service.EmployeeActionService;
import com.example.employeemanagement.service.PdfGeneratorService;
import com.example.employeemanagement.security.JwtTokenUtil;
import com.example.employeemanagement.security.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmployeeController.class)
@AutoConfigureMockMvc(addFilters = false)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeService employeeService;

    @MockBean
    private EmployeeActionService employeeActionService;

    @MockBean
    private PdfGeneratorService pdfGeneratorService;

    @MockBean
    private JwtTokenUtil jwtTokenUtil;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private JpaMetamodelMappingContext jpaMetamodelMappingContext;

    @Test
    void uploadPhoto_ShouldReturnOk_WhenFileIsValid() throws Exception {
        Long employeeId = 1L;
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "photo.jpg",
                "image/jpeg",
                "photo-content".getBytes()
        );

        mockMvc.perform(multipart("/api/employees/{id}/photo", employeeId)
                        .file(file))
                .andExpect(status().isOk());

        verify(employeeService).uploadPhoto(eq(employeeId), any());
    }

    @Test
    void uploadPhoto_ShouldReturnBadRequest_WhenFileIsEmpty() throws Exception {
        Long employeeId = 1L;
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "photo.jpg",
                "image/jpeg",
                new byte[0]
        );

        mockMvc.perform(multipart("/api/employees/{id}/photo", employeeId)
                        .file(file))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getPhoto_ShouldReturnOk_WhenPhotoExists() throws Exception {
        Long employeeId = 1L;
        EmployeePhotoDTO dto = new EmployeePhotoDTO();
        dto.setEmployeeId(employeeId);
        dto.setBase64Image("base64encodedstring");
        dto.setContentType("image/jpeg");

        when(employeeService.getPhoto(employeeId)).thenReturn(dto);

        mockMvc.perform(get("/api/employees/{id}/photo", employeeId))
                .andExpect(status().isOk());
    }

    @Test
    void getPhoto_ShouldReturnNotFound_WhenPhotoDoesNotExist() throws Exception {
        Long employeeId = 1L;

        when(employeeService.getPhoto(employeeId)).thenReturn(null);

        mockMvc.perform(get("/api/employees/{id}/photo", employeeId))
                .andExpect(status().isNotFound());
    }
}
