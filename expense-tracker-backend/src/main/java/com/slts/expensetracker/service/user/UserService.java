package com.slts.expensetracker.service.user;

import com.slts.expensetracker.dto.user.UserProfileResponse;
import com.slts.expensetracker.dto.user.UserProfileUpdateRequest;
import com.slts.expensetracker.dto.user.ChangePasswordRequest;
import com.slts.expensetracker.entity.User;
import com.slts.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getProfile() {

        User user = getCurrentUser();

        return mapToResponse(user);
    }

    public UserProfileResponse updateProfile(
            UserProfileUpdateRequest request) {

        User user = getCurrentUser();

        user.setName(request.getName());
        user.setAddress(request.getAddress());

        User updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    public void changePassword(ChangePasswordRequest request) {

        User user = getCurrentUser();

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Current password is incorrect"
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "New password must be different from current password"
            );
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new IllegalArgumentException(
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        ));
    }

    private UserProfileResponse mapToResponse(User user) {

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .address(user.getAddress())
                .build();
    }
}