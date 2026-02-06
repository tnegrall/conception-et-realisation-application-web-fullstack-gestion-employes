package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.UserDTO;
import com.example.employeemanagement.model.User;
import com.example.employeemanagement.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User APIs", description = "API Operations related to users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Operation(summary = "Get all users", description = "Retrieve a list of all registered users")
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = users.stream().map(user -> {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }
}
