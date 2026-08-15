package com.slts.expensetracker.controller;

import com.slts.expensetracker.dto.common.ApiResponse;
import com.slts.expensetracker.dto.dashboard.CategorySummaryResponse;
import com.slts.expensetracker.dto.dashboard.DashboardSummaryResponse;
import com.slts.expensetracker.dto.dashboard.MonthlySummaryResponse;
import com.slts.expensetracker.dto.dashboard.RecentTransactionResponse;
import com.slts.expensetracker.service.dashboard.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary() {

        DashboardSummaryResponse summary =
                dashboardService.getSummary();

        ApiResponse<DashboardSummaryResponse> response =
                ApiResponse.<DashboardSummaryResponse>builder()
                        .success(true)
                        .message("Dashboard summary retrieved successfully")
                        .data(summary)
                        .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategorySummaryResponse>>> getExpenseByCategory() {

        List<CategorySummaryResponse> data =
                dashboardService.getExpenseByCategory();

        ApiResponse<List<CategorySummaryResponse>> response =
                ApiResponse.<List<CategorySummaryResponse>>builder()
                        .success(true)
                        .message("Expense category summary retrieved successfully")
                        .data(data)
                        .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<MonthlySummaryResponse>> getMonthlySummary() {

        MonthlySummaryResponse data =
                dashboardService.getMonthlySummary();

        ApiResponse<MonthlySummaryResponse> response =
                ApiResponse.<MonthlySummaryResponse>builder()
                        .success(true)
                        .message("Monthly summary retrieved successfully")
                        .data(data)
                        .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent-transactions")
    public ResponseEntity<ApiResponse<List<RecentTransactionResponse>>> getRecentTransactions() {

        List<RecentTransactionResponse> data =
                dashboardService.getRecentTransactions();

        ApiResponse<List<RecentTransactionResponse>> response =
                ApiResponse.<List<RecentTransactionResponse>>builder()
                        .success(true)
                        .message("Recent transactions retrieved successfully")
                        .data(data)
                        .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/highest-expense-category")
    public ResponseEntity<ApiResponse<CategorySummaryResponse>>
    getHighestExpenseCategory(
            @RequestParam int year,
            @RequestParam int month) {

        CategorySummaryResponse data =
                dashboardService.getHighestExpenseCategory(
                        year,
                        month
                );

        ApiResponse<CategorySummaryResponse> response =
                ApiResponse.<CategorySummaryResponse>builder()
                        .success(true)
                        .message(
                                "Highest expense category retrieved successfully"
                        )
                        .data(data)
                        .build();

        return ResponseEntity.ok(response);
    }
}