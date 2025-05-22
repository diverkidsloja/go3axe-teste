
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
}) => {
  const colorClasses = {
    primary: 'bg-go3-primary text-white',
    success: 'bg-go3-success text-white',
    warning: 'bg-go3-warning text-white',
    error: 'bg-go3-error text-white',
    info: 'bg-go3-info text-white',
  };

  return (
    <div className="go3-card-stat">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-go3-muted">{title}</h3>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4">
          <span className={`inline-flex items-center text-sm ${trend.isPositive ? 'text-go3-success' : 'text-go3-error'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
            <span className="ml-1 text-go3-muted">em relação ao mês anterior</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
