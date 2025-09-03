import React from 'react';
import Card from './Card';
import CashIcon from './icons/CashIcon';
import LoanIcon from './icons/LoanIcon';

interface AccountSummaryProps {
  cashBalance: number;
  loanBalance: number;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ cashBalance, loanBalance }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', { style: 'currency', currency: 'NPR' }).format(amount);
  };

  return (
    <Card title="Account Balances">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
              <CashIcon className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Cash on Hand</span>
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(cashBalance)}</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
              <LoanIcon className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Loan Balance</span>
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(loanBalance)}</span>
        </div>
      </div>
    </Card>
  );
};

export default AccountSummary;