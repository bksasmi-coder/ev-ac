import React, { useMemo, useState } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import AccountSummary from './components/AccountSummary';
import ProfitLossStatement from './components/ProfitLossStatement';
import { Transaction, ServiceRecord } from './types';
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
import { useSimulatedCloudStorage } from './hooks/useSimulatedCloudStorage';
import { useTransactionCalculations } from './hooks/useTransactionCalculations';
import ServiceAndRepair from './components/ServiceAndRepair';


function App() {
  const [isDark, toggleTheme] = useDarkMode();
  const { isAuthenticated, currentUser, login, logout, register, error: authError } = useAuth();
  
  const initialTransactions = useMemo(() => [], []);
  const transactionStorageKey = `transactions_${currentUser}`;
  const {
    data: transactions,
    setData: setTransactions,
    isLoading: isTransactionsLoading,
    error: transactionsError
  } = useSimulatedCloudStorage<Transaction[]>(transactionStorageKey, initialTransactions);

  const initialServiceRecords = useMemo(() => [], []);
  const serviceStorageKey = `service_records_${currentUser}`;
  const {
    data: serviceRecords,
    setData: setServiceRecords,
    isLoading: isServiceLoading,
    error: serviceError
  } = useSimulatedCloudStorage<ServiceRecord[]>(serviceStorageKey, initialServiceRecords);


  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'report' | 'service'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lastDescription, setLastDescription] = useState('');

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    setTransactions(prev => [...prev, newTransaction]);
    setLastDescription(transaction.description);
    setIsAddModalOpen(false);
  };
  
  const handleAddServiceRecord = (record: Omit<ServiceRecord, 'id'>) => {
      const newRecord = { ...record, id: crypto.randomUUID() };
      setServiceRecords(prev => [...prev, newRecord]);
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
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
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

  const { totalIncome, totalExpenses, cashBalance, loanBalance } = useTransactionCalculations(transactions);
  
  const isLoading = isTransactionsLoading || isServiceLoading;


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
            {isLoading && (
                <div className="flex flex-col justify-center items-center h-64" aria-live="polite" aria-busy="true">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                    <p className="ml-4 text-lg text-gray-600 dark:text-gray-400 mt-4">Loading your data...</p>
                </div>
            )}
            
            {(transactionsError || serviceError) && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
                    <p className="font-bold">Storage Error</p>
                    <p>{transactionsError || serviceError}</p>
                </div>
            )}
            
            {!isLoading && !transactionsError && !serviceError && (
              <>
                {activeView === 'dashboard' ? (
                  <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AccountSummary cashBalance={cashBalance} loanBalance={loanBalance} />
                        <ProfitLossStatement totalIncome={totalIncome} totalExpenses={totalExpenses} />
                      </div>
                      <TransactionList transactions={transactions} onEdit={handleStartEdit} onDelete={handleRequestDelete} />
                  </div>
                ) : activeView === 'report' ? (
                    <MonthlyReport transactions={transactions} />
                ) : (
                    <ServiceAndRepair records={serviceRecords} onAddRecord={handleAddServiceRecord} />
                )}
              </>
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