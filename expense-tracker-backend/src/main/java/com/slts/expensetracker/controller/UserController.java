package com.slts.expensetracker.controller;

import com.slts.expensetracker.dto.common.ApiResponse;
import com.slts.expensetracker.dto.user.ChangePasswordRequest;
import com.slts.expensetracker.dto.user.UserProfileResponse;
import com.slts.expensetracker.dto.user.UserProfileUpdateRequest;
import com.slts.expensetracker.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile() {

        UserProfileResponse profile =
                userService.getProfile();

        ApiResponse<UserProfileResponse> response =
                ApiResponse.<UserProfileResponse>builder()
                        .success(true)
                        .message("User profile retrieved successfully")
                        .data(profile)
                        .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @Valid @RequestBody UserProfileUpdateRequest request) {

        UserProfileResponse profile =
                userService.updateProfile(request);

        ApiResponse<UserProfileResponse> response =
                ApiResponse.<UserProfileResponse>builder()
                        .success(true)
                        .message("User profile updated successfully")
                        .data(profile)
                        .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(request);

        ApiResponse<Void> response =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Password changed successfully")
                        .data(null)
                        .build();

        return ResponseEntity.ok(response);
    }
}