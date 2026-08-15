package com.slts.expensetracker.dto.dashboard;

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
public class RecentTransactionResponse {

    private Long id;

    private String type;

    private String title;

    private BigDecimal amount;

    private String category;

    private LocalDate date;

    private String note;
}