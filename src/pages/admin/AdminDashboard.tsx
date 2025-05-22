
import React from 'react';
import { DollarSign, Users, CreditCard, Calendar, Clock, UserPlus, FileText, Link } from 'lucide-react';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import StatCard from '../../components/StatCard';
import TransactionList from '../../components/TransactionList';
import DashboardCalendar from '../../components/DashboardCalendar';
import ActionButton from '../../components/ActionButton';
import { useData } from '../../contexts/DataContext';
import { formatCurrency } from '../../utils/format';

const AdminDashboard: React.FC = () => {
  const { partners, getDashboardData, getTransactions } = useData();
  const dashboardData = getDashboardData();
  const transactions = getTransactions();

  return (
    <div className="min-h-screen bg-go3-light flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <PageTitle
          title="Dashboard Go3AxePay - Admin"
          subtitle="Visão geral do desempenho da plataforma"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Recebido"
            value={formatCurrency(dashboardData.totalReceivedAmount)}
            icon={DollarSign}
            color="success"
            trend={{ value: 12, isPositive: true }}
          />
          
          <StatCard
            title="Total Pendente"
            value={formatCurrency(dashboardData.totalPendingAmount)}
            icon={Clock}
            color="warning"
          />
          
          <StatCard
            title="Total de Parceiros"
            value={partners.length}
            icon={Users}
            color="primary"
            trend={{ value: 5, isPositive: true }}
          />
          
          <StatCard
            title="Transações no Mês"
            value={dashboardData.confirmedTransactions + dashboardData.pendingTransactions}
            icon={CreditCard}
            color="info"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TransactionList
              transactions={dashboardData.recentTransactions}
              title="Transações Recentes"
            />
          </div>
          
          <div>
            <DashboardCalendar transactions={dashboardData.upcomingPayments} />
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4 font-oceanshore text-go3-primary">Ações Rápidas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <ActionButton
                icon={DollarSign}
                label="Extrato"
                to="/admin/extract"
              />
              
              <ActionButton
                icon={FileText}
                label="Nova Cobrança"
                to="/admin/extract"
              />
              
              <ActionButton
                icon={UserPlus}
                label="Subconta Asaas"
                to="/admin/subconta"
              />

              <ActionButton
                icon={CreditCard}
                label="Transações"
                to="/admin/transactions"
              />

              <ActionButton
                icon={Link}
                label="Criar Link"
                to="/admin/payment-links"
              />

              <ActionButton
                icon={DollarSign}
                label="Transferência"
                to="/admin/transfer"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4 font-oceanshore text-go3-primary">Status dos Parceiros</h3>
            <div className="space-y-4">
              {partners.slice(0, 3).map((partner) => (
                <div key={partner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{partner.companyName}</p>
                    <p className="text-sm text-go3-muted">{partner.email}</p>
                  </div>
                  <span className={`go3-badge ${partner.isActive ? 'go3-badge-success' : 'go3-badge-error'}`}>
                    {partner.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
