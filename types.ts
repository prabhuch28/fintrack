
export enum CategoryType {
  LIVING = 'Living',
  TRANSPORT = 'Transport',
  FINANCE = 'Finance',
  EMERGENCY = 'Emergency'
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: CategoryType;
  subCategory?: string;
  upiId?: string;
}

export interface CategoryState {
  id: CategoryType;
  spent: number;
  limit: number;
  transactions: Transaction[];
}

export interface AppState {
  userName: string;
  totalBalance: number;
  categories: Record<CategoryType, CategoryState>;
  emergencyFund: number;
  savingsGoal: number;
}

export interface AIInsight {
  category: CategoryType;
  tip: string;
  status: 'info' | 'warning' | 'critical';
}
