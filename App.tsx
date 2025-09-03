import React, { useMemo, useState } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import AccountSummary from './components/AccountSummary';
import ProfitLossStatement from './components/ProfitLossStatement';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Transaction, TransactionType, AccountType } from './types';
import EditTransactionModal from './components/EditTransactionModal';
import MonthlyReport from './components/MonthlyReport';
import BottomNavBar from './components/BottomNavBar';
import InstallPWA from './components/InstallPWA';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { useDarkMode } from './hooks/useDarkMode';
import SunIcon from './components/icons/SunIcon';
import MoonIcon from './components/icons/MoonIcon';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import LogoutIcon from './components/icons/LogoutIcon';

function App() {
  const [isDark, toggleTheme] = useDarkMode();
  const { isAuthenticated, currentUser, login, logout, register, error: authError } = useAuth();
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(`transactions_${currentUser}`, []);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'report'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lastDescription, setLastDescription] = useState('');

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().toISOString() + Math.random(),
    };
    setTransactions(prev => [...prev, newTransaction]);
    setLastDescription(transaction.description);
    setIsAddModalOpen(false);
  };

  const handleStartEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };
  
  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(t =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
    setEditingTransaction(null);
  };

  const handleRequestDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
  };

  const handleCancelDelete = () => {
      setTransactionToDelete(null);
  };

  const handleConfirmDelete = () => {
      if (transactionToDelete) {
          setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
          setTransactionToDelete(null);
      }
  };


  const { totalIncome, totalExpenses, cashBalance, loanBalance } = useMemo(() => {
    return transactions.reduce((acc, t) => {
        // P&L statement should only include operational income/expenses, not balance sheet changes like loans.
        if (t.account !== AccountType.LOAN) {
            if (t.type === TransactionType.INCOME) {
                acc.totalIncome += t.amount;
            } else {
                acc.totalExpenses += t.amount;
            }
        }

        // Account balance calculations
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
  }, [transactions]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} onRegister={register} authError={authError} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-xl sm:text-3xl font-bold leading-tight text-gray-900 dark:text-white">
              EV Account Manager
            </h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
                  aria-label="Toggle theme"
              >
                  {isDark ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-700" />}
              </button>
              <InstallPWA />
              <button
                  onClick={logout}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
                  aria-label="Logout"
              >
                  <LogoutIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {activeView === 'dashboard' ? (
              <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AccountSummary cashBalance={cashBalance} loanBalance={loanBalance} />
                    <ProfitLossStatement totalIncome={totalIncome} totalExpenses={totalExpenses} />
                  </div>
                  <TransactionList transactions={transactions} onEdit={handleStartEdit} onDelete={handleRequestDelete} loanBalance={loanBalance} />
              </div>
            ) : (
                <MonthlyReport transactions={transactions} />
            )}
        </div>
      </main>

      {isAddModalOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={handleCancelAdd}
        >
            <div 
                className="w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <TransactionForm
                  onAddTransaction={handleAddTransaction}
                  onCancel={handleCancelAdd}
                  lastDescription={lastDescription}
                />
            </div>
        </div>
      )}

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          onCancel={handleCancelEdit}
        />
      )}
      
      {transactionToDelete && (
        <DeleteConfirmationModal
            transaction={transactionToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
        />
      )}

      <BottomNavBar 
        activeView={activeView}
        onViewChange={setActiveView}
        onAdd={() => setIsAddModalOpen(true)}
      />
    </div>
  );
}

export default App;