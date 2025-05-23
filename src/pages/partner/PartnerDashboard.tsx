
import React from 'react';
import { DollarSign, CheckCircle, AlertCircle, Clock, CreditCard, Banknote, FileText, Link as LinkIcon } from 'lucide-react';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import StatCard from '../../components/StatCard';
import TransactionList from '../../components/TransactionList';
import DashboardCalendar from '../../components/DashboardCalendar';
import ActionButton from '../../components/ActionButton';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { formatCurrency } from '../../utils/format';

const PartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getDashboardData } = useData();
  
  // Get dashboard data for this partner
  const dashboardData = getDashboardData(user?.id);

  return (
    <div className="min-h-screen bg-go3-light flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <PageTitle
          title={`Dashboard - ${user?.name}`}
          subtitle="Visão geral das suas operações financeiras"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Recebidos"
            value={formatCurrency(dashboardData.totalReceivedAmount)}
            icon={CheckCircle}
            color="success"
          />
          
          <StatCard
            title="Confirmados"
            value={dashboardData.confirmedTransactions.toString()}
            icon={DollarSign}
            color="success"
          />
          
          <StatCard
            title="Aguardando Pagamento"
            value={formatCurrency(dashboardData.totalPendingAmount)}
            icon={Clock}
            color="warning"
          />
          
          <StatCard
            title="Vencidos"
            value={formatCurrency(dashboardData.totalOverdueAmount)}
            icon={AlertCircle}
            color="error"
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
        
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4 font-oceanshore text-go3-primary">Ações Rápidas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <ActionButton
                icon={DollarSign}
                label="Meu Extrato"
                to="/partner/extract"
              />
              
              <ActionButton
                icon={FileText}
                label="Nova Cobrança"
                to="/partner/new-charge"
              />
              
              <ActionButton
                icon={CreditCard}
                label="Minhas Transações"
                to="/partner/transactions"
              />
              
              <ActionButton
                icon={LinkIcon}
                label="Criar Link"
                to="/partner/payment-links"
              />
              
              <ActionButton
                icon={Banknote}
                label="Emitir Boleto"
                to="/partner/new-charge?forma=boleto"
              />
              
              <ActionButton
                icon={DollarSign}
                label="Transferência"
                to="/partner/transfer"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PartnerDashboard;
