
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, AccountType } from '../types';
import Card from './Card';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  lastDescription?: string;
}

// @ts-ignore
declare const NepaliDate: any;

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, onCancel, lastDescription = '' }) => {
  const [description, setDescription] = useState(lastDescription);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.INCOME);
  const [account, setAccount] = useState<AccountType>(AccountType.CASH);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (descriptionInputRef.current) {
        descriptionInputRef.current.focus();
        // If there's a default description, move cursor to the end
        if (lastDescription) {
            const val = descriptionInputRef.current.value;
            descriptionInputRef.current.value = '';
            descriptionInputRef.current.value = val;
        }
    }
  }, [lastDescription]);
  
  const nepaliDateString = useMemo(() => {
    if (!date || typeof NepaliDate === 'undefined') return '';
    try {
        const [year, month, day] = date.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);
        const nepaliDate = new NepaliDate(localDate);
        return nepaliDate.format('MMMM D, YYYY');
    } catch (e) {
        console.error("Could not convert date to Nepali date:", e);
        return 'Invalid Date';
    }
  }, [date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description.trim() || isNaN(numericAmount) || numericAmount <= 0 || !date) {
      setError('Please fill out all fields with valid values.');
      return;
    }
    setError('');

    // Create a date object from the input string, treating it as local time.
    // Add current time to preserve sort order for transactions on the same day.
    const transactionDate = new Date(date + 'T00:00:00'); 
    const now = new Date();
    transactionDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

    onAddTransaction({
      description,
      amount: numericAmount,
      type: transactionType,
      account,
      date: transactionDate.toISOString(),
    });

    // Reset form - description will be handled by parent state
    setDescription('');
    setAmount('');
    setTransactionType(TransactionType.INCOME);
    setAccount(AccountType.CASH);
    setDate(new Date().toISOString().split('T')[0]);
    descriptionInputRef.current?.focus();
  };
  
  const incomeLabel = account === AccountType.LOAN ? 'Withdrawal' : 'Income';
  const expenseLabel = account === AccountType.LOAN ? 'Pay Loan' : 'Expense';

  return (
    <Card title="Add New Transaction">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
          />
           {nepaliDateString && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Nepali Date: {nepaliDateString}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <input
            ref={descriptionInputRef}
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
            placeholder="e.g., Groceries, Salary"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div>
          <div className="flex rounded-md shadow-sm">
            <button type="button" onClick={() => setAccount(AccountType.CASH)} className={`flex-1 py-2 px-4 text-sm font-medium focus:z-10 focus:outline-none ${account === AccountType.CASH ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'} border border-gray-300 dark:border-gray-600 rounded-l-md`}>Cash</button>
            <button type="button" onClick={() => setAccount(AccountType.LOAN)} className={`-ml-px flex-1 py-2 px-4 text-sm font-medium focus:z-10 focus:outline-none ${account === AccountType.LOAN ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'} border border-gray-300 dark:border-gray-600 rounded-r-md`}>Loan</button>
          </div>
        </div>

        <div>
            <div className="flex rounded-md shadow-sm">
              <button type="button" onClick={() => setTransactionType(TransactionType.INCOME)} className={`flex-1 py-2 px-4 text-sm font-medium focus:z-10 focus:outline-none ${transactionType === TransactionType.INCOME ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'} border border-gray-300 dark:border-gray-600 rounded-l-md`}>{incomeLabel}</button>
              <button type="button" onClick={() => setTransactionType(TransactionType.EXPENSE)} className={`-ml-px flex-1 py-2 px-4 text-sm font-medium focus:z-10 focus:outline-none ${transactionType === TransactionType.EXPENSE ? 'bg-red-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'} border border-gray-300 dark:border-gray-600 rounded-r-md`}>{expenseLabel}</button>
            </div>
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex items-center justify-end space-x-4 pt-2">
           <button 
              type="button" 
              onClick={onCancel}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            Cancel
          </button>
          <button 
              type="submit" 
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Transaction
          </button>
        </div>
      </form>
    </Card>
  );
};

export default TransactionForm;