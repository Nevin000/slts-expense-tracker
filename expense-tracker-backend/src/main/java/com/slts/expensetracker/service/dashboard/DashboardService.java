package com.slts.expensetracker.service.dashboard;

import com.slts.expensetracker.dto.dashboard.CategorySummaryResponse;
import com.slts.expensetracker.dto.dashboard.DashboardSummaryResponse;
import com.slts.expensetracker.dto.dashboard.MonthlySummaryResponse;
import com.slts.expensetracker.dto.dashboard.RecentTransactionResponse;
import com.slts.expensetracker.entity.Expense;
import com.slts.expensetracker.entity.Income;
import com.slts.expensetracker.entity.User;
import com.slts.expensetracker.repository.ExpenseRepository;
import com.slts.expensetracker.repository.IncomeRepository;
import com.slts.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public DashboardSummaryResponse getSummary() {

        User user = getCurrentUser();

        List<Expense> expenses =
                expenseRepository.findByUserOrderByTransactionDateDesc(user);

        List<Income> incomes =
                incomeRepository.findByUserOrderByReceivedDateDesc(user);

        BigDecimal totalExpense = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalIncome = incomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal balance = totalIncome.subtract(totalExpense);

        return DashboardSummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(balance)
                .build();
    }

    public List<CategorySummaryResponse> getExpenseByCategory() {

        User user = getCurrentUser();

        List<Expense> expenses =
                expenseRepository.findByUserOrderByTransactionDateDesc(user);

        Map<String, BigDecimal> categoryTotals = expenses.stream()
                .collect(Collectors.groupingBy(
                        expense -> expense.getCategory().name(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Expense::getAmount,
                                BigDecimal::add
                        )
                ));

        List<CategorySummaryResponse> response = new ArrayList<>();

        categoryTotals.forEach((category, amount) ->
                response.add(
                        CategorySummaryResponse.builder()
                                .category(category)
                                .amount(amount)
                                .build()
                )
        );

        return response;
    }

    public MonthlySummaryResponse getMonthlySummary() {

        User user = getCurrentUser();

        LocalDate today = LocalDate.now();

        LocalDate startDate = today.withDayOfMonth(1);

        LocalDate endDate = today.withDayOfMonth(
                today.lengthOfMonth()
        );

        List<Expense> expenses =
                expenseRepository.findByUserAndTransactionDateBetween(
                        user,
                        startDate,
                        endDate
                );

        List<Income> incomes =
                incomeRepository.findByUserAndReceivedDateBetween(
                        user,
                        startDate,
                        endDate
                );

        BigDecimal totalExpense = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalIncome = incomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal balance = totalIncome.subtract(totalExpense);

        return MonthlySummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(balance)
                .build();
    }

    public CategorySummaryResponse getHighestExpenseCategory(
            int year,
            int month) {

        User user = getCurrentUser();

        LocalDate startDate =
                LocalDate.of(year, month, 1);

        LocalDate endDate =
                startDate.withDayOfMonth(
                        startDate.lengthOfMonth()
                );

        List<Expense> expenses =
                expenseRepository.findByUserAndTransactionDateBetween(
                        user,
                        startDate,
                        endDate
                );

        if (expenses.isEmpty()) {
            return CategorySummaryResponse.builder()
                    .category(null)
                    .amount(BigDecimal.ZERO)
                    .build();
        }

        Map<String, BigDecimal> categoryTotals =
                expenses.stream()
                        .collect(Collectors.groupingBy(
                                expense ->
                                        expense.getCategory().name(),
                                Collectors.reducing(
                                        BigDecimal.ZERO,
                                        Expense::getAmount,
                                        BigDecimal::add
                                )
                        ));

        return categoryTotals.entrySet()
                .stream()
                .max(
                        Map.Entry.comparingByValue()
                )
                .map(entry ->
                        CategorySummaryResponse.builder()
                                .category(entry.getKey())
                                .amount(entry.getValue())
                                .build()
                )
                .orElse(
                        CategorySummaryResponse.builder()
                                .category(null)
                                .amount(BigDecimal.ZERO)
                                .build()
                );
    }

    public List<RecentTransactionResponse> getRecentTransactions() {

        User user = getCurrentUser();

        List<Expense> expenses =
                expenseRepository.findByUserOrderByTransactionDateDesc(user);

        List<Income> incomes =
                incomeRepository.findByUserOrderByReceivedDateDesc(user);

        List<RecentTransactionResponse> transactions = new ArrayList<>();

        expenses.forEach(expense ->
                transactions.add(
                        RecentTransactionResponse.builder()
                                .id(expense.getId())
                                .type("EXPENSE")
                                .title(expense.getTitle())
                                .amount(expense.getAmount())
                                .category(expense.getCategory().name())
                                .date(expense.getTransactionDate())
                                .note(expense.getNote())
                                .build()
                )
        );

        incomes.forEach(income ->
                transactions.add(
                        RecentTransactionResponse.builder()
                                .id(income.getId())
                                .type("INCOME")
                                .title(income.getSource())
                                .amount(income.getAmount())
                                .category("INCOME")
                                .date(income.getReceivedDate())
                                .note(income.getNote())
                                .build()
                )
        );

        return transactions.stream()
                .sorted(Comparator.comparing(
                        RecentTransactionResponse::getDate
                ).reversed())
                .limit(5)
                .toList();
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new IllegalArgumentException(
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        ));
    }
}