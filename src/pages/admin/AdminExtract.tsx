
import React, { useState } from 'react';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { formatCurrency } from '../../utils/format';

const AdminExtract: React.FC = () => {
  const { user } = useAuth();
  const { getTransactions } = useData();
  const transactions = getTransactions();
  
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
  });

  const filteredTransactions = transactions.filter(tx => {
    // Apply basic filtering (would be more sophisticated in a real app)
    if (filter.type !== 'all' && tx.status !== filter.type) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-go3-light flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <PageTitle
          title="Extrato Financeiro"
          subtitle="Acompanhe todos os movimentos financeiros da plataforma"
        />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-medium mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data Inicial</label>
              <input 
                type="date" 
                className="go3-input w-full"
                value={filter.startDate}
                onChange={(e) => setFilter({...filter, startDate: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Data Final</label>
              <input 
                type="date" 
                className="go3-input w-full"
                value={filter.endDate}
                onChange={(e) => setFilter({...filter, endDate: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select 
                className="go3-input w-full"
                value={filter.type}
                onChange={(e) => setFilter({...filter, type: e.target.value})}
              >
                <option value="all">Todos</option>
                <option value="confirmed">Pagos</option>
                <option value="pending">Pendentes</option>
                <option value="overdue">Vencidos</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button className="go3-btn-primary">Aplicar Filtros</button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 gap-4 p-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-go3-muted">Total Recebido</p>
              <p className="text-xl font-semibold">{formatCurrency(15780.45)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-go3-muted">Total Pendente</p>
              <p className="text-xl font-semibold">{formatCurrency(3250.00)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-go3-muted">Total Transferido</p>
              <p className="text-xl font-semibold">{formatCurrency(12500.00)}</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="go3-table">
              <thead>
                <tr className="bg-gray-50">
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td>{tx.customerName}</td>
                    <td>{tx.transactionType}</td>
                    <td>
                      <span className={`go3-badge go3-badge-${tx.status === 'confirmed' ? 'success' : tx.status === 'pending' ? 'warning' : 'error'}`}>
                        {tx.status === 'confirmed' ? 'Pago' : tx.status === 'pending' ? 'Pendente' : 'Vencido'}
                      </span>
                    </td>
                    <td className={`${tx.status === 'confirmed' ? 'text-go3-success' : 'text-go3-muted'} font-medium`}>
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminExtract;
