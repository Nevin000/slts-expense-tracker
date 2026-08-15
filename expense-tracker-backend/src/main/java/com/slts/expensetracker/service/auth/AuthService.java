package com.slts.expensetracker.service.auth;

import com.slts.expensetracker.dto.auth.RegisterRequest;
import com.slts.expensetracker.dto.auth.LoginRequest;
import com.slts.expensetracker.dto.auth.LoginResponse;
import com.slts.expensetracker.entity.User;
import com.slts.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.slts.expensetracker.security.JwtService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .address(request.getAddress())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}