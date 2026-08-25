package com.slts.expensetracker.repository;

import com.slts.expensetracker.entity.Expense;
import com.slts.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
public interface Cateory extends DashboardSummaryResponse<Expense, Long>{
    List<Expense> summarycategory(User user);

    Optional<Expense> DashboardSummaryResponse (Long id, User user);

    List<Expense> findExpenseBy(
            User user,
            LocalDate startDate,
            LocalDate endDate
    );
}
