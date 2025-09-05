import { useMemo } from 'react';
import { Transaction, TransactionType, AccountType } from '../types';

// @ts-ignore
declare const NepaliDate: any;

export function useTransactionCalculations(transactions: Transaction[], month?: number, year?: number) {
    
    const monthlyFilteredTransactions = useMemo(() => {
        if (typeof month !== 'number' || typeof year !== 'number' || typeof NepaliDate === 'undefined') {
            return transactions;
        }
        return transactions.filter(t => {
            try {
                const nepaliTxDate = new NepaliDate(new Date(t.date));
                return nepaliTxDate.getYear() === year && nepaliTxDate.getMonth() === month;
            } catch (e) {
                console.error("Could not parse Nepali date for transaction", t, e);
                return false;
            }
        });
    }, [transactions, month, year]);

    const sortedTransactions = useMemo(() => {
        return [...monthlyFilteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [monthlyFilteredTransactions]);

    const incomeTransactions = useMemo(() => sortedTransactions.filter(t => t.type === TransactionType.INCOME && t.account !== AccountType.LOAN), [sortedTransactions]);
    const expenseTransactions = useMemo(() => sortedTransactions.filter(t => t.type === TransactionType.EXPENSE && t.account !== AccountType.LOAN), [sortedTransactions]);
    const loanTransactions = useMemo(() => sortedTransactions.filter(t => t.account === AccountType.LOAN), [sortedTransactions]);
    
    // For dashboard totals, we use all transactions, not just monthly filtered ones.
    const totals = useMemo(() => {
        const source = (typeof month === 'number' && typeof year === 'number') ? monthlyFilteredTransactions : transactions;
        return source.reduce((acc, t) => {
            // P&L statement should only include operational income/expenses, not balance sheet changes like loans.
            if (t.account !== AccountType.LOAN) {
                if (t.type === TransactionType.INCOME) {
                    acc.totalIncome += t.amount;
                } else {
                    acc.totalExpenses += t.amount;
                }
            }

            if (t.type === TransactionType.INCOME) {
                if (t.account === AccountType.CASH) {
                    acc.cashBalance += t.amount;
                } else if (t.account === AccountType.LOAN) {
                    acc.loanBalance += t.amount; // Taking a loan increases liability
                }
            } else { // EXPENSE
                if (t.account === AccountType.CASH) {
                    acc.cashBalance -= t.amount;
                } else if (t.account === AccountType.LOAN) {
                    acc.loanBalance -= t.amount; // Repaying a loan decreases liability
                }
            }
            return acc;
        }, {
            totalIncome: 0,
            totalExpenses: 0,
            cashBalance: 0,
            loanBalance: 0,
        });
    }, [transactions, monthlyFilteredTransactions, month, year]);

    return {
        ...totals,
        sortedTransactions,
        incomeTransactions,
        expenseTransactions,
        loanTransactions,
    };
}
