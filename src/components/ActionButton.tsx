
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  to: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, to, onClick }) => {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="p-4 bg-white border border-gray-100 rounded-lg hover:border-go3-primary/20 hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center text-go3-primary"
    >
      <Icon size={24} />
      <span className="mt-2 text-sm font-medium">{label}</span>
    </Link>
  );
};

export default ActionButton;
