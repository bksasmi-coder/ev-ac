
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum AccountType {
  CASH = 'cash',
  LOAN = 'loan',
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  account: AccountType;
  date: string;
}