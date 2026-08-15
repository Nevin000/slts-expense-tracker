package com.slts.expensetracker.dto.expense;

import com.slts.expensetracker.entity.ExpenseCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseResponse {

    private Long id;

    private String title;

    private ExpenseCategory category;

    private BigDecimal amount;

    private LocalDate transactionDate;

    private String note;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}