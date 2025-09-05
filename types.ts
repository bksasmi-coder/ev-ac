
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

export enum ServiceType {
  SERVICING = 'Servicing',
  REPAIRING = 'Repairing',
  TIRE = 'Tire',
}

export enum TireServiceType {
  NEW = 'Tire New',
  RESOLE = 'Tire Resole',
  ROTATION = 'Tire Rotation',
}

export interface ServiceRecord {
  id: string;
  date: string;
  odometer: number;
  description: string;
  cost: number;
  notes?: string;
  serviceTypes: ServiceType[];
  tireCompany?: string;
  tires?: {
    fl: boolean;
    fr: boolean;
    rl: boolean;
    rr: boolean;
    spare: boolean;
  };
}