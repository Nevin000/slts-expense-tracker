package com.slts.expensetracker.controller;

import com.slts.expensetracker.dto.auth.LoginRequest;
import com.slts.expensetracker.dto.auth.RegisterRequest;
import com.slts.expensetracker.dto.auth.LoginResponse;
import com.slts.expensetracker.dto.common.ApiResponse;
import com.slts.expensetracker.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequest request) {

        authService.register(request);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("User registered successfully")
                .data(null)
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse loginResponse = authService.login(request);

        ApiResponse<LoginResponse> response = ApiResponse.<LoginResponse>builder()
                .success(true)
                .message("Login successful")
                .data(loginResponse)
                .build();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }
}