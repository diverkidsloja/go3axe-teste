
import React from 'react';
import { DollarSign, Users, CreditCard, Calendar, Clock, UserPlus } from 'lucide-react';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import StatCard from '../../components/StatCard';
import TransactionList from '../../components/TransactionList';
import DashboardCalendar from '../../components/DashboardCalendar';
import { useData } from '../../contexts/DataContext';
import { formatCurrency } from '../../utils/format';
import { Link } from 'react-router-dom';

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
            <h3 className="text-lg font-medium mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex flex-col items-center justify-center text-go3-primary">
                <DollarSign size={24} />
                <span className="mt-2 text-sm font-medium">Extrato</span>
              </button>
              
              <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex flex-col items-center justify-center text-go3-primary">
                <CreditCard size={24} />
                <span className="mt-2 text-sm font-medium">Nova Cobrança</span>
              </button>
              
              <Link to="/admin/subconta" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex flex-col items-center justify-center text-go3-primary">
                <UserPlus size={24} />
                <span className="mt-2 text-sm font-medium">Subconta Asaas</span>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Status dos Parceiros</h3>
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
