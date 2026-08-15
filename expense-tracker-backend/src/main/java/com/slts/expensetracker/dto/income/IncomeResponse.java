package com.slts.expensetracker.dto.income;

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
public class IncomeResponse {

    private Long id;

    private String source;

    private BigDecimal amount;

    private LocalDate receivedDate;

    private String note;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}