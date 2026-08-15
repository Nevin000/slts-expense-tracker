package com.slts.expensetracker.dto.expense;

import com.slts.expensetracker.entity.ExpenseCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateExpenseRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotNull(message = "Category is required")
    private ExpenseCategory category;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Transaction date is required")
    private LocalDate transactionDate;

    @Size(max = 500, message = "Note must not exceed 500 characters")
    private String note;
}