import React from 'react';
import Card from './Card';

interface ProfitLossStatementProps {
  totalIncome: number;
  totalExpenses: number;
}

const ProfitLossStatement: React.FC<ProfitLossStatementProps> = ({ totalIncome, totalExpenses }) => {
  const netProfit = totalIncome - totalExpenses;
  const isProfit = netProfit >= 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', { style: 'currency', currency: 'NPR' }).format(amount);
  };

  return (
    <Card title="Profit & Loss">
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
          <span className="font-bold text-gray-800 dark:text-white">Net {isProfit ? 'Profit' : 'Loss'}</span>
          <span className={`font-bold ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(netProfit)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ProfitLossStatement;