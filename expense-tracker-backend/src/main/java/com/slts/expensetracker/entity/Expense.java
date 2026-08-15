package com.slts.expensetracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "expenses",
        indexes = {
                @Index(name = "idx_expenses_user", columnList = "user_id"),
                @Index(name = "idx_expenses_transaction_date", columnList = "transaction_date"),
                @Index(name = "idx_expenses_user_date", columnList = "user_id, transaction_date")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_expense_user")
    )
    private User user;

    @Column(nullable = false, length = 150)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ExpenseCategory category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(length = 500)
    private String note;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}