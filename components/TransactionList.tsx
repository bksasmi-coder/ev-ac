
import React, { useMemo } from 'react';
import { Transaction, TransactionType, AccountType } from '../types';
import Card from './Card';
import CashIcon from './icons/CashIcon';
import LoanIcon from './icons/LoanIcon';
import TrashIcon from './icons/TrashIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  loanBalance: number;
}

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

// @ts-ignore
declare const NepaliDate: any;


const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onEdit, onDelete }) => {
    const isIncome = transaction.type === TransactionType.INCOME;
    const amountColor = isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    const sign = isIncome ? '+' : '-';
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ne-NP', { style: 'currency', currency: 'NPR' }).format(amount);
    };

    const gregorianDate = new Date(transaction.date);
    const gregorianDateString = gregorianDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    let nepaliDateString = '';
    if (typeof NepaliDate !== 'undefined') {
        try {
            const nepaliDate = new NepaliDate(gregorianDate);
            nepaliDateString = nepaliDate.format('MMMM D, YYYY');
        } catch (e) {
            console.error("Could not convert date to Nepali date:", e);
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
        <li 
            className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-150 group"
        >
            <div className="flex items-center space-x-3 flex-grow overflow-hidden">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(transaction);
                    }}
                    className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Delete transaction: ${transaction.description}`}
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
                 <div 
                    className="flex items-center space-x-4 flex-grow overflow-hidden cursor-pointer"
                    onClick={() => onEdit(transaction)}
                    role="button"
                    aria-label={`Edit transaction: ${transaction.description}`}
                >
                    <div className={`p-2 rounded-full flex-shrink-0 ${isIncome ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                       <AccountIcon />
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{transaction.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {nepaliDateString ? `${nepaliDateString} / ` : ''}{gregorianDateString} &middot; <span className="capitalize">{transaction.account}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div 
                className={`text-right font-semibold ${amountColor} ml-2 cursor-pointer`}
                onClick={() => onEdit(transaction)}
            >
                {sign} {formatCurrency(transaction.amount)}
            </div>
        </li>
    );
};


const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete, loanBalance }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', { style: 'currency', currency: 'NPR' }).format(amount);
  };

  const { incomeTransactions, expenseTransactions, loanTransactions } = useMemo(() => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return {
      incomeTransactions: sortedTransactions.filter(t => t.type === TransactionType.INCOME && t.account !== AccountType.LOAN),
      expenseTransactions: sortedTransactions.filter(t => t.type === TransactionType.EXPENSE && t.account !== AccountType.LOAN),
      loanTransactions: sortedTransactions.filter(t => t.account === AccountType.LOAN),
    };
  }, [transactions]);

  return (
    <Card title="Recent Transactions" className="h-full">
      {transactions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Add one using the form to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
          {/* Income Column */}
          <div>
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 border-b-2 border-green-200 dark:border-green-800 pb-2 mb-2">Income</h3>
            {incomeTransactions.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700 -mx-2">
                {incomeTransactions.map(tx => (
                  <TransactionItem key={tx.id} transaction={tx} onEdit={onEdit} onDelete={onDelete} />
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
                  <TransactionItem key={tx.id} transaction={tx} onEdit={onEdit} onDelete={onDelete} />
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
            <div className="flex justify-between items-baseline border-b-2 border-purple-200 dark:border-purple-800 pb-2 mb-2">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Loans</h3>
              {loanBalance > 0 && (
                 <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                   Due: {formatCurrency(loanBalance)}
                 </span>
              )}
            </div>
            {loanTransactions.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700 -mx-2">
                {loanTransactions.map(tx => (
                  <TransactionItem key={tx.id} transaction={tx} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm">No loan transactions.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default TransactionList;
