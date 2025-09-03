import React from 'react';
import Card from './Card';
import { Transaction } from '../types';

interface DeleteConfirmationModalProps {
  transaction: Transaction;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ transaction, onConfirm, onCancel }) => {
  if (!transaction) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      aria-modal="true"
      role="dialog"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <Card title="Confirm Deletion">
          <div className="space-y-6">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to permanently delete this transaction?
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white truncate">{transaction.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount: {new Intl.NumberFormat('ne-NP', { style: 'currency', currency: 'NPR' }).format(transaction.amount)}
                </p>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">This action cannot be undone.</p>
            <div className="flex items-center justify-end space-x-4 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
