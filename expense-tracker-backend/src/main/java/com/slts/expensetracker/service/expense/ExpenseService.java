package com.slts.expensetracker.service.expense;

import com.slts.expensetracker.dto.expense.CreateExpenseRequest;
import com.slts.expensetracker.dto.expense.ExpenseResponse;
import com.slts.expensetracker.dto.expense.UpdateExpenseRequest;
import com.slts.expensetracker.entity.Expense;
import com.slts.expensetracker.entity.User;
import com.slts.expensetracker.exception.ResourceNotFoundException;
import com.slts.expensetracker.repository.ExpenseRepository;
import com.slts.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseResponse createExpense(CreateExpenseRequest request) {

        User user = getCurrentUser();

        Expense expense = Expense.builder()
                .title(request.getTitle())
                .amount(request.getAmount())
                .category(request.getCategory())
                .transactionDate(request.getTransactionDate())
                .note(request.getNote())
                .user(user)
                .build();

        Expense savedExpense = expenseRepository.save(expense);

        return mapToResponse(savedExpense);
    }

    public List<ExpenseResponse> getAllExpenses() {

        User user = getCurrentUser();

        return expenseRepository
                .findByUserOrderByTransactionDateDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ExpenseResponse getExpenseById(Long id) {

        User user = getCurrentUser();

        Expense expense = expenseRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Expense not found"));

        return mapToResponse(expense);
    }

    public ExpenseResponse updateExpense(
            Long id,
            UpdateExpenseRequest request) {

        User user = getCurrentUser();

        Expense expense = expenseRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Expense not found"));

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setTransactionDate(request.getTransactionDate());
        expense.setNote(request.getNote());

        Expense updatedExpense = expenseRepository.save(expense);

        return mapToResponse(updatedExpense);
    }

    public void deleteExpense(Long id) {

        User user = getCurrentUser();

        Expense expense = expenseRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Expense not found"));

        expenseRepository.delete(expense);
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

    private ExpenseResponse mapToResponse(Expense expense) {

        return ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .transactionDate(expense.getTransactionDate())
                .note(expense.getNote())
                .build();
    }
}