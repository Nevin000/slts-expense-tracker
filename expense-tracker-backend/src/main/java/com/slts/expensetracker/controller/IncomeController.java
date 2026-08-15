package com.slts.expensetracker.controller;

import com.slts.expensetracker.dto.common.ApiResponse;
import com.slts.expensetracker.dto.income.CreateIncomeRequest;
import com.slts.expensetracker.dto.income.IncomeResponse;
import com.slts.expensetracker.dto.income.UpdateIncomeRequest;
import com.slts.expensetracker.service.income.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<ApiResponse<IncomeResponse>> createIncome(
            @Valid @RequestBody CreateIncomeRequest request) {

        IncomeResponse income = incomeService.createIncome(request);

        ApiResponse<IncomeResponse> response =
                ApiResponse.<IncomeResponse>builder()
                        .success(true)
                        .message("Income created successfully")
                        .data(income)
                        .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<IncomeResponse>>> getAllIncomes() {

        List<IncomeResponse> incomes = incomeService.getAllIncomes();

        ApiResponse<List<IncomeResponse>> response =
                ApiResponse.<List<IncomeResponse>>builder()
                        .success(true)
                        .message("Incomes retrieved successfully")
                        .data(incomes)
                        .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IncomeResponse>> getIncomeById(
            @PathVariable Long id) {

        IncomeResponse income = incomeService.getIncomeById(id);

        ApiResponse<IncomeResponse> response =
                ApiResponse.<IncomeResponse>builder()
                        .success(true)
                        .message("Income retrieved successfully")
                        .data(income)
                        .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IncomeResponse>> updateIncome(
            @PathVariable Long id,
            @Valid @RequestBody UpdateIncomeRequest request) {

        IncomeResponse income =
                incomeService.updateIncome(id, request);

        ApiResponse<IncomeResponse> response =
                ApiResponse.<IncomeResponse>builder()
                        .success(true)
                        .message("Income updated successfully")
                        .data(income)
                        .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIncome(
            @PathVariable Long id) {

        incomeService.deleteIncome(id);

        ApiResponse<Void> response =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Income deleted successfully")
                        .data(null)
                        .build();

        return ResponseEntity.ok(response);
    }
}