
import React from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/format';

interface DashboardCalendarProps {
  transactions: Transaction[];
}

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ transactions }) => {
  // Group transactions by due date
  const groupedByDate: Record<string, Transaction[]> = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.dueDate).toLocaleDateString('pt-BR');
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(transaction);
  });

  // Calculate total by date
  const totalByDate: Record<string, number> = {};
  
  Object.entries(groupedByDate).forEach(([date, txs]) => {
    totalByDate[date] = txs.reduce((sum, tx) => sum + tx.amount, 0);
  });

  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Get first day of the month and calculate the first day of the calendar
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const firstDayOfCalendar = new Date(firstDayOfMonth);
  firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfMonth.getDay());
  
  // Get last day of the month and calculate the last day of the calendar
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const lastDayOfCalendar = new Date(lastDayOfMonth);
  lastDayOfCalendar.setDate(lastDayOfCalendar.getDate() + (6 - lastDayOfMonth.getDay()));
  
  // Generate calendar days
  const calendarDays = [];
  const currentDate = new Date(firstDayOfCalendar);
  
  while (currentDate <= lastDayOfCalendar) {
    calendarDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthName = now.toLocaleDateString('pt-BR', { month: 'long' });
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Calendário de Recebimentos</h3>
        <div className="font-medium text-go3-primary">
          {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {currentYear}
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-medium text-go3-muted py-2 text-sm">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day) => {
          const dateString = day.toLocaleDateString('pt-BR');
          const hasTransactions = !!groupedByDate[dateString];
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isToday = day.toDateString() === now.toDateString();
          
          return (
            <div
              key={day.toString()}
              className={`
                p-2 rounded-lg text-center min-h-[80px] border
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                ${isToday ? 'border-go3-accent' : 'border-gray-100'}
                ${hasTransactions ? 'hover:shadow-md transition-shadow' : ''}
              `}
            >
              <div className="text-sm font-medium">{day.getDate()}</div>
              {hasTransactions && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-go3-primary">
                    {groupedByDate[dateString].length} {groupedByDate[dateString].length === 1 ? 'pagamento' : 'pagamentos'}
                  </div>
                  <div className="text-xs font-bold mt-1">
                    {formatCurrency(totalByDate[dateString])}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardCalendar;
