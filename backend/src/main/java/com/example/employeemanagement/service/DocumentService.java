package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.DocumentDTO;
import com.example.employeemanagement.model.Document;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.repository.DocumentRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    private final String uploadDir;
    private final Path uploadPath;

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "application/pdf",
            "image/jpeg",
            "image/png",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain"
    );

    public DocumentService(@Value("${file.upload-dir}") String uploadDir) {
        this.uploadDir = uploadDir;
        logger.info("Initializing DocumentService with upload directory: {}", uploadDir);
        try {
            this.uploadPath = Paths.get(uploadDir);
            Files.createDirectories(this.uploadPath);
            logger.info("Upload directory successfully created/verified at: {}", this.uploadPath.toAbsolutePath());
        } catch (Exception ex) {
            logger.error("Failed to create upload directory: {}", uploadDir, ex);
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public List<DocumentDTO> getDocumentsByEmployeeId(Long employeeId) {
        return documentRepository.findByEmployeeId(employeeId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DocumentDTO uploadDocument(Long employeeId, MultipartFile file, String type, String title) throws IOException {
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Type de fichier non supporté: " + file.getContentType());
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        Path employeeDir = this.uploadPath.resolve("employees/" + employeeId);
        Files.createDirectories(employeeDir);

        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;
        
        Path targetLocation = employeeDir.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        Document document = new Document();
        document.setEmployee(employee);
        document.setTitle(title);
        document.setType(type);
        document.setFilePath(targetLocation.toString());
        document.setFileName(originalFileName);
        document.setContentType(file.getContentType());
        
        Document savedDoc = documentRepository.save(document);
        return toDTO(savedDoc);
    }
    
    @Transactional
    public void deleteDocument(Long id) throws IOException {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));
        
        Path filePath = Paths.get(document.getFilePath());
        Files.deleteIfExists(filePath);
        
        documentRepository.deleteById(id);
    }
    
    public Document getDocument(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));
    }

    private DocumentDTO toDTO(Document document) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(document.getId());
        dto.setEmployeeId(document.getEmployee().getId());
        dto.setTitle(document.getTitle());
        dto.setType(document.getType());
        dto.setFileName(document.getFileName());
        dto.setContentType(document.getContentType());
        dto.setUploadedAt(document.getUploadedAt());
        
        String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/documents/download/")
                .path(document.getId().toString())
                .toUriString();
        dto.setDownloadUrl(downloadUrl);
        
        return dto;
    }
}
