
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Partner, Fee, Transaction, Dashboard } from '../types';

interface DataContextType {
  partners: Partner[];
  addPartner: (partner: Omit<Partner, 'id' | 'role' | 'createdAt'>) => Promise<void>;
  updatePartner: (id: string, partner: Partial<Partner>) => Promise<void>;
  togglePartnerStatus: (id: string) => Promise<void>;
  getFees: (partnerId: string) => Fee[];
  updateFees: (partnerId: string, fees: Omit<Fee, 'id' | 'partnerId'>[]) => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  getTransactions: (partnerId?: string) => Transaction[];
  getDashboardData: (partnerId?: string) => Dashboard;
}

const DataContext = createContext<DataContextType>({
  partners: [],
  addPartner: async () => {},
  updatePartner: async () => {},
  togglePartnerStatus: async () => {},
  getFees: () => [],
  updateFees: async () => {},
  createTransaction: async () => {},
  getTransactions: () => [],
  getDashboardData: () => ({
    totalReceivedAmount: 0,
    totalPendingAmount: 0,
    totalOverdueAmount: 0,
    confirmedTransactions: 0,
    pendingTransactions: 0,
    overdueTransactions: 0,
    recentTransactions: [],
    upcomingPayments: [],
  }),
});

export const useData = () => useContext(DataContext);

// Mock data
const MOCK_PARTNERS: Partner[] = [
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@parceiro.com',
    role: 'partner',
    companyName: 'Empresa do João',
    responsibleName: 'João Silva',
    document: '123.456.789-00',
    phone: '(71) 99999-9999',
    apiKey: 'api_key_joao123',
    walletId: 'wallet_asaas_joao123',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Maria Souza',
    email: 'maria@parceiro.com',
    role: 'partner',
    companyName: 'Empresa da Maria',
    responsibleName: 'Maria Souza',
    document: '987.654.321-00',
    phone: '(71) 88888-8888',
    apiKey: 'api_key_maria123',
    walletId: 'wallet_asaas_maria123',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const MOCK_FEES: Fee[] = [
  {
    id: '1',
    partnerId: '2',
    transactionType: 'boleto',
    fixedAmount: 2.5,
    percentageAmount: 1.5,
  },
  {
    id: '2',
    partnerId: '2',
    transactionType: 'pix',
    fixedAmount: 1.0,
    percentageAmount: 1.0,
  },
  {
    id: '3',
    partnerId: '2',
    transactionType: 'credit_upfront',
    fixedAmount: 0.0,
    percentageAmount: 3.0,
  },
  {
    id: '4',
    partnerId: '2',
    transactionType: 'credit_2_6',
    fixedAmount: 0.0,
    percentageAmount: 4.5,
  },
  {
    id: '5',
    partnerId: '2',
    transactionType: 'credit_7_12',
    fixedAmount: 0.0,
    percentageAmount: 6.0,
  },
  {
    id: '6',
    partnerId: '2',
    transactionType: 'debit',
    fixedAmount: 0.0,
    percentageAmount: 2.0,
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    partnerId: '2',
    customerId: 'c1',
    customerName: 'Cliente Final 1',
    amount: 1500.00,
    platformFee: 45.00,
    transactionType: 'credit_upfront',
    status: 'confirmed',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  },
  {
    id: '2',
    partnerId: '2',
    customerId: 'c2',
    customerName: 'Cliente Final 2',
    amount: 800.00,
    platformFee: 24.00,
    transactionType: 'pix',
    status: 'pending',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    partnerId: '3',
    customerId: 'c3',
    customerName: 'Cliente Final 3',
    amount: 2500.00,
    platformFee: 75.00,
    transactionType: 'credit_2_6',
    status: 'confirmed',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  },
  {
    id: '4',
    partnerId: '2',
    customerId: 'c4',
    customerName: 'Cliente Final 4',
    amount: 350.00,
    platformFee: 10.50,
    transactionType: 'boleto',
    status: 'overdue',
    dueDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [fees, setFees] = useState<Fee[]>(MOCK_FEES);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  // Load data from localStorage on initialization
  useEffect(() => {
    const storedPartners = localStorage.getItem('go3axepay_partners');
    const storedFees = localStorage.getItem('go3axepay_fees');
    const storedTransactions = localStorage.getItem('go3axepay_transactions');

    if (storedPartners) setPartners(JSON.parse(storedPartners));
    if (storedFees) setFees(JSON.parse(storedFees));
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('go3axepay_partners', JSON.stringify(partners));
    localStorage.setItem('go3axepay_fees', JSON.stringify(fees));
    localStorage.setItem('go3axepay_transactions', JSON.stringify(transactions));
  }, [partners, fees, transactions]);

  const addPartner = async (partnerData: Omit<Partner, 'id' | 'role' | 'createdAt'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPartner: Partner = {
      ...partnerData,
      id: `partner_${Math.random().toString(36).substring(2, 9)}`,
      role: 'partner',
      createdAt: new Date().toISOString(),
    };
    
    setPartners(prev => [...prev, newPartner]);
    
    // Create default fees for the new partner
    const defaultFees = [
      { transactionType: 'boleto', fixedAmount: 2.5, percentageAmount: 1.5 },
      { transactionType: 'pix', fixedAmount: 1.0, percentageAmount: 1.0 },
      { transactionType: 'credit_upfront', fixedAmount: 0.0, percentageAmount: 3.0 },
      { transactionType: 'credit_2_6', fixedAmount: 0.0, percentageAmount: 4.5 },
      { transactionType: 'credit_7_12', fixedAmount: 0.0, percentageAmount: 6.0 },
      { transactionType: 'debit', fixedAmount: 0.0, percentageAmount: 2.0 },
    ] as Omit<Fee, 'id' | 'partnerId'>[];
    
    await updateFees(newPartner.id, defaultFees);
  };

  const updatePartner = async (id: string, partnerData: Partial<Partner>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setPartners(prev => 
      prev.map(partner => 
        partner.id === id ? { ...partner, ...partnerData } : partner
      )
    );
  };

  const togglePartnerStatus = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setPartners(prev => 
      prev.map(partner => 
        partner.id === id ? { ...partner, isActive: !partner.isActive } : partner
      )
    );
  };

  const getFees = (partnerId: string) => {
    return fees.filter(fee => fee.partnerId === partnerId);
  };

  const updateFees = async (partnerId: string, newFees: Omit<Fee, 'id' | 'partnerId'>[]) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove existing fees for this partner
    const otherFees = fees.filter(fee => fee.partnerId !== partnerId);
    
    // Add new fees
    const updatedFees = [
      ...otherFees,
      ...newFees.map(fee => ({
        id: `fee_${Math.random().toString(36).substring(2, 9)}`,
        partnerId,
        ...fee,
      })),
    ];
    
    setFees(updatedFees);
  };

  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'status'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTransaction: Transaction = {
      ...transactionData,
      id: `tx_${Math.random().toString(36).substring(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setTransactions(prev => [...prev, newTransaction]);
  };

  const getTransactions = (partnerId?: string) => {
    if (!partnerId) return transactions;
    return transactions.filter(tx => tx.partnerId === partnerId);
  };

  const getDashboardData = (partnerId?: string): Dashboard => {
    const filteredTransactions = partnerId 
      ? transactions.filter(tx => tx.partnerId === partnerId)
      : transactions;
    
    const confirmedTxs = filteredTransactions.filter(tx => tx.status === 'confirmed');
    const pendingTxs = filteredTransactions.filter(tx => tx.status === 'pending');
    const overdueTxs = filteredTransactions.filter(tx => tx.status === 'overdue');
    
    const totalReceived = confirmedTxs.reduce((sum, tx) => sum + tx.amount, 0);
    const totalPending = pendingTxs.reduce((sum, tx) => sum + tx.amount, 0);
    const totalOverdue = overdueTxs.reduce((sum, tx) => sum + tx.amount, 0);
    
    // Sort by created date (most recent first)
    const recentTransactions = [...filteredTransactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    // Upcoming payments (sorted by due date)
    const upcomingPayments = [...pendingTxs]
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
    
    return {
      totalReceivedAmount: totalReceived,
      totalPendingAmount: totalPending,
      totalOverdueAmount: totalOverdue,
      confirmedTransactions: confirmedTxs.length,
      pendingTransactions: pendingTxs.length,
      overdueTransactions: overdueTxs.length,
      recentTransactions,
      upcomingPayments,
    };
  };

  return (
    <DataContext.Provider
      value={{
        partners,
        addPartner,
        updatePartner,
        togglePartnerStatus,
        getFees,
        updateFees,
        createTransaction,
        getTransactions,
        getDashboardData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
