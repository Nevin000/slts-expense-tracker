package com.slts.expensetracker.service.income;

import com.slts.expensetracker.dto.income.CreateIncomeRequest;
import com.slts.expensetracker.dto.income.IncomeResponse;
import com.slts.expensetracker.dto.income.UpdateIncomeRequest;
import com.slts.expensetracker.entity.Income;
import com.slts.expensetracker.entity.User;
import com.slts.expensetracker.exception.ResourceNotFoundException;
import com.slts.expensetracker.repository.IncomeRepository;
import com.slts.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public IncomeResponse createIncome(CreateIncomeRequest request) {

        User user = getCurrentUser();

        Income income = Income.builder()
                .source(request.getSource())
                .amount(request.getAmount())
                .receivedDate(request.getReceivedDate())
                .note(request.getNote())
                .user(user)
                .build();

        Income savedIncome = incomeRepository.save(income);

        return mapToResponse(savedIncome);
    }

    public List<IncomeResponse> getAllIncomes() {

        User user = getCurrentUser();

        return incomeRepository
                .findByUserOrderByReceivedDateDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public IncomeResponse getIncomeById(Long id) {

        User user = getCurrentUser();

        Income income = incomeRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Income not found"));

        return mapToResponse(income);
    }

    public IncomeResponse updateIncome(
            Long id,
            UpdateIncomeRequest request) {

        User user = getCurrentUser();

        Income income = incomeRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Income not found"));

        income.setSource(request.getSource());
        income.setAmount(request.getAmount());
        income.setReceivedDate(request.getReceivedDate());
        income.setNote(request.getNote());

        Income updatedIncome = incomeRepository.save(income);

        return mapToResponse(updatedIncome);
    }

    public void deleteIncome(Long id) {

        User user = getCurrentUser();

        Income income = incomeRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Income not found"));

        incomeRepository.delete(income);
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new IllegalArgumentException("User is not authenticated");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    private IncomeResponse mapToResponse(Income income) {

        return IncomeResponse.builder()
                .id(income.getId())
                .source(income.getSource())
                .amount(income.getAmount())
                .receivedDate(income.getReceivedDate())
                .note(income.getNote())
                .build();
    }
}