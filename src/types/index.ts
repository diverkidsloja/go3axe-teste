
export type UserRole = 'admin' | 'partner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Admin extends User {
  walletId: string;
}

export interface Partner extends User {
  companyName: string;
  responsibleName: string;
  document: string; // CPF/CNPJ
  phone: string;
  apiKey: string;
  walletId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Fee {
  id: string;
  partnerId: string;
  transactionType: 'boleto' | 'pix' | 'credit_upfront' | 'credit_2_6' | 'credit_7_12' | 'debit';
  fixedAmount: number;
  percentageAmount: number;
}

export interface Transaction {
  id: string;
  partnerId: string;
  customerId: string;
  customerName: string;
  amount: number;
  platformFee: number;
  transactionType: 'boleto' | 'pix' | 'credit_upfront' | 'credit_2_6' | 'credit_7_12' | 'debit';
  status: 'pending' | 'confirmed' | 'overdue' | 'cancelled' | 'refunded';
  dueDate: string;
  createdAt: string;
  paidAt?: string;
}

export interface Dashboard {
  totalReceivedAmount: number;
  totalPendingAmount: number;
  totalOverdueAmount: number;
  confirmedTransactions: number;
  pendingTransactions: number;
  overdueTransactions: number;
  recentTransactions: Transaction[];
  upcomingPayments: Transaction[];
}
