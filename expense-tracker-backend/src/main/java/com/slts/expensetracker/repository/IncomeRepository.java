package com.slts.expensetracker.repository;

import com.slts.expensetracker.entity.Expense;
import com.slts.expensetracker.entity.Income;
import com.slts.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUserOrderByReceivedDateDesc(User user);

    Optional<Income> findByIdAndUser(Long id, User user);

    List<Income> findByUserAndReceivedDateBetween(
            User user,
            LocalDate startDate,
            LocalDate endDate
    );
}