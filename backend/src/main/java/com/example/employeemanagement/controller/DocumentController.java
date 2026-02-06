package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.DocumentDTO;
import com.example.employeemanagement.model.Document;
import com.example.employeemanagement.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@Tag(name = "Document Management", description = "Operations related to employee documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get documents by employee ID")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(documentService.getDocumentsByEmployeeId(employeeId));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a document")
    public ResponseEntity<DocumentDTO> uploadDocument(
            @RequestParam("employeeId") Long employeeId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type,
            @RequestParam("title") String title) throws IOException {
        
        return ResponseEntity.ok(documentService.uploadDocument(employeeId, file, type, title));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a document")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) throws IOException {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/download/{id}")
    @Operation(summary = "Download a document")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) throws IOException {
        Document document = documentService.getDocument(id);
        Path filePath = Paths.get(document.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        
        if (resource.exists()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(document.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getFileName() + "\"")
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
