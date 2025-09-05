
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, AccountType } from '../types';
import Card from './Card';
import CashIcon from './icons/CashIcon';
import LoanIcon from './icons/LoanIcon';
import { useTransactionCalculations } from '../hooks/useTransactionCalculations';

// @ts-ignore
declare const NepaliDate: any;

interface MonthlyReportProps {
  transactions: Transaction[];
}

const ReportTransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isIncome = transaction.type === TransactionType.INCOME;
    const amountColor = isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    const sign = isIncome ? '+' : '-';
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ne-NP', { style: 'currency', currency: 'NPR' }).format(amount);
    };

    const gregorianDate = new Date(transaction.date);
    let nepaliDateString = '';
    if (typeof NepaliDate !== 'undefined') {
        try {
            const nepaliDate = new NepaliDate(gregorianDate);
            nepaliDateString = nepaliDate.format('MMMM D, YYYY');
        } catch (e) {
            console.error("Could not convert date:", e);
        }
    }

    const AccountIcon = () => {
        const iconClass = "w-5 h-5 text-gray-500 dark:text-gray-400";
        switch (transaction.account) {
            case AccountType.CASH: return <CashIcon className={iconClass} />;
            case AccountType.LOAN: return <LoanIcon className={iconClass} />;
            default: return null;
        }
    };

    return (
        <li className="flex items-center justify-between py-3 px-2">
            <div className="flex items-center space-x-4 overflow-hidden">
                <div className={`p-2 rounded-full flex-shrink-0 ${isIncome ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                   <AccountIcon />
                </div>
                <div className="flex-grow overflow-hidden">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{transaction.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {nepaliDateString} &middot; <span className="capitalize">{transaction.account}</span>
                    </p>
                </div>
            </div>
            <div className={`text-right font-semibold ${amountColor} ml-2`}>
                {sign} {formatCurrency(transaction.amount)}
            </div>
        </li>
    );
};


const MonthlyReport: React.FC<MonthlyReportProps> = ({ transactions }) => {
    const nepaliMonths = useMemo(() => {
        if (typeof NepaliDate !== 'undefined' && Array.isArray(NepaliDate.bsMonths)) {
            const months = NepaliDate.bsMonths.map((month: any) => String(month || '').trim());
            if (months.length === 12 && months[0]) {
                 return months;
            }
        }
        return [
            'Baisakh', 'Jestha', 'Asar', 'Shrawan', 'Bhadra', 'Aswin', 
            'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
        ];
    }, []);

    const { availableYears, defaultYear, defaultMonth } = useMemo(() => {
        if (typeof NepaliDate === 'undefined') {
            const fallbackYear = new Date().getFullYear() + 57;
            const years = Array.from({ length: 10 }, (_, i) => fallbackYear + i);
            return { availableYears: years, defaultYear: fallbackYear, defaultMonth: 0 };
        }

        const now = new NepaliDate();
        const currentYear = now.getYear();
        const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

        return {
            availableYears: years,
            defaultYear: currentYear,
            defaultMonth: now.getMonth(),
        };
    }, []);
    
    const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(defaultMonth);

    const {
        totalIncome,
        totalExpenses,
        incomeTransactions,
        expenseTransactions,
        loanTransactions,
        sortedTransactions,
    } = useTransactionCalculations(transactions, selectedMonth, selectedYear);


    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ne-NP', { style: 'currency', currency: 'NPR' }).format(amount);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Monthly Report (Bikram Sambat)</h2>
            </div>

            <Card title="Select Period">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year (B.S.)</label>
                        <select
                            id="year-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Month</label>
                        <select
                            id="month-select"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {nepaliMonths.map((month, index) => (
                                <option key={month} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>
            
            <Card title={`Summary for ${nepaliMonths[selectedMonth] || ''} ${selectedYear}`}>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Total Income</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Total Expenses</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</span>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-600" />
                    <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-gray-800 dark:text-white">Net {totalIncome - totalExpenses >= 0 ? 'Profit' : 'Loss'}</span>
                        <span className={`font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatCurrency(totalIncome - totalExpenses)}
                        </span>
                    </div>
                </div>
            </Card>

            <Card title="Transactions This Month">
                {sortedTransactions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                        {/* Income Column */}
                        <div>
                            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 border-b-2 border-green-200 dark:border-green-800 pb-2 mb-2">Income</h3>
                            {incomeTransactions.length > 0 ? (
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700 -mx-2">
                                    {incomeTransactions.map(tx => (
                                        <ReportTransactionItem key={tx.id} transaction={tx} />
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">No income transactions.</p>
                                </div>
                            )}
                        </div>

                        {/* Expenses Column */}
                        <div>
                            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 border-b-2 border-red-200 dark:border-red-800 pb-2 mb-2">Expenses</h3>
                            {expenseTransactions.length > 0 ? (
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700 -mx-2">
                                    {expenseTransactions.map(tx => (
                                        <ReportTransactionItem key={tx.id} transaction={tx} />
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">No expense transactions.</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Loans Column */}
                        <div>
                            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 border-b-2 border-purple-200 dark:border-purple-800 pb-2 mb-2">Loans</h3>
                            {loanTransactions.length > 0 ? (
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700 -mx-2">
                                    {loanTransactions.map(tx => (
                                        <ReportTransactionItem key={tx.id} transaction={tx} />
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">No loan transactions.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">No transactions for this month.</p>
                    </div>
                )}
            </Card>

        </div>
    );
};

export default MonthlyReport;