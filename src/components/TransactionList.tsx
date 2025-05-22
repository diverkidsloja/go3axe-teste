
import React from 'react';
import { formatCurrency } from '../utils/format';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, title }) => {
  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="go3-badge go3-badge-success">Confirmado</span>;
      case 'pending':
        return <span className="go3-badge go3-badge-info">Pendente</span>;
      case 'overdue':
        return <span className="go3-badge go3-badge-error">Atrasado</span>;
      case 'cancelled':
        return <span className="go3-badge go3-badge-default">Cancelado</span>;
      case 'refunded':
        return <span className="go3-badge go3-badge-warning">Reembolsado</span>;
      default:
        return null;
    }
  };

  const getTransactionTypeLabel = (type: Transaction['transactionType']) => {
    switch (type) {
      case 'boleto':
        return 'Boleto';
      case 'pix':
        return 'PIX';
      case 'credit_upfront':
        return 'Cartão (à vista)';
      case 'credit_2_6':
        return 'Cartão (2-6x)';
      case 'credit_7_12':
        return 'Cartão (7-12x)';
      case 'debit':
        return 'Débito';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">{title || 'Transações Recentes'}</h3>
        <div className="text-center py-8 text-go3-muted">
          Nenhuma transação encontrada.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium">{title || 'Transações Recentes'}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="go3-table">
          <thead className="bg-gray-50">
            <tr>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="py-4 px-6">
                  <div className="text-sm font-medium">{transaction.customerName}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm font-medium">{formatCurrency(transaction.amount)}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm">{getTransactionTypeLabel(transaction.transactionType)}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm">{formatDate(transaction.createdAt)}</div>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(transaction.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
