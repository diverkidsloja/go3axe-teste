
import React, { useState } from 'react';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { formatCurrency } from '../../utils/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, Eye } from 'lucide-react';

const AdminTransactions: React.FC = () => {
  const { user } = useAuth();
  const { getTransactions } = useData();
  const transactions = getTransactions();
  
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'all',
    type: 'all',
    search: '',
  });

  const filteredTransactions = transactions.filter(tx => {
    if (filters.status !== 'all' && tx.status !== filters.status) return false;
    if (filters.type !== 'all' && tx.transactionType !== filters.type) return false;
    if (filters.search && !tx.customerName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-go3-light flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <PageTitle
          title="Transações"
          subtitle="Gerencie todas as transações da plataforma"
        />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-medium mb-4 font-oceanshore text-go3-primary">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data Inicial</label>
              <input 
                type="date" 
                name="startDate"
                className="go3-input w-full"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Data Final</label>
              <input 
                type="date" 
                name="endDate"
                className="go3-input w-full"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                name="status"
                className="go3-input w-full"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">Todos</option>
                <option value="confirmed">Pagos</option>
                <option value="pending">Pendentes</option>
                <option value="overdue">Vencidos</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select 
                name="type"
                className="go3-input w-full"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="all">Todos</option>
                <option value="boleto">Boleto</option>
                <option value="pix">PIX</option>
                <option value="credit_upfront">Cartão à vista</option>
                <option value="credit_2_6">Cartão 2-6x</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Busca</label>
              <input 
                type="text" 
                name="search"
                placeholder="Nome do cliente..."
                className="go3-input w-full"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <Button variant="outline">Limpar</Button>
            <Button>Aplicar Filtros</Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="text-lg font-medium font-oceanshore text-go3-primary">Transações ({filteredTransactions.length})</h3>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Exportar
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{new Date(tx.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{tx.customerName}</TableCell>
                    <TableCell>{tx.partnerId}</TableCell>
                    <TableCell>{tx.transactionType}</TableCell>
                    <TableCell>
                      <span className={`go3-badge go3-badge-${tx.status === 'confirmed' ? 'success' : tx.status === 'pending' ? 'warning' : 'error'}`}>
                        {tx.status === 'confirmed' ? 'Pago' : tx.status === 'pending' ? 'Pendente' : 'Vencido'}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(tx.amount)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTransactions;
