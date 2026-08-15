package com.slts.expensetracker.controller;

import com.slts.expensetracker.dto.common.ApiResponse;
import com.slts.expensetracker.dto.expense.CreateExpenseRequest;
import com.slts.expensetracker.dto.expense.ExpenseResponse;
import com.slts.expensetracker.dto.expense.UpdateExpenseRequest;
import com.slts.expensetracker.service.expense.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @Valid @RequestBody CreateExpenseRequest request) {

        ExpenseResponse expense = expenseService.createExpense(request);

        ApiResponse<ExpenseResponse> response =
                ApiResponse.<ExpenseResponse>builder()
                        .success(true)
                        .message("Expense created successfully")
                        .data(expense)
                        .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getAllExpenses() {

        List<ExpenseResponse> expenses = expenseService.getAllExpenses();

        ApiResponse<List<ExpenseResponse>> response =
                ApiResponse.<List<ExpenseResponse>>builder()
                        .success(true)
                        .message("Expenses retrieved successfully")
                        .data(expenses)
                        .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpenseById(
            @PathVariable Long id) {

        ExpenseResponse expense = expenseService.getExpenseById(id);

        ApiResponse<ExpenseResponse> response =
                ApiResponse.<ExpenseResponse>builder()
                        .success(true)
                        .message("Expense retrieved successfully")
                        .data(expense)
                        .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody UpdateExpenseRequest request) {

        ExpenseResponse expense =
                expenseService.updateExpense(id, request);

        ApiResponse<ExpenseResponse> response =
                ApiResponse.<ExpenseResponse>builder()
                        .success(true)
                        .message("Expense updated successfully")
                        .data(expense)
                        .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @PathVariable Long id) {

        expenseService.deleteExpense(id);

        ApiResponse<Void> response =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Expense deleted successfully")
                        .data(null)
                        .build();

        return ResponseEntity.ok(response);
    }
}