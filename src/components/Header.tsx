
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, User, Settings, Users, FileText, CreditCard, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileMenu) setShowProfileMenu(false);
  };

  const handleLogout = () => {
    logout();
  };

  const isAdmin = user?.role === 'admin';

  return (
    <header className="bg-white shadow-sm z-20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Menu */}
          <div className="flex items-center space-x-8">
            <Logo size="md" />
            
            <nav className="hidden md:flex space-x-6">
              <Link to={isAdmin ? "/admin/dashboard" : "/partner/dashboard"} className="font-medium text-go3-primary hover:text-go3-accent transition-colors">
                Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin/partners" className="font-medium text-go3-primary hover:text-go3-accent transition-colors">
                  Parceiros
                </Link>
              )}
              <Link to={isAdmin ? "/admin/transactions" : "/partner/transactions"} className="font-medium text-go3-primary hover:text-go3-accent transition-colors">
                Transações
              </Link>
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              >
                <Bell size={20} className="text-go3-primary" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-go3-accent rounded-full flex items-center justify-center text-xs text-go3-primary font-medium">
                  2
                </span>
              </button>

              {/* Dropdown for notifications */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20">
                  <div className="px-4 py-2 border-b">
                    <h3 className="font-medium">Notificações</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 border-b">
                      <p className="text-sm font-medium">Nova transação recebida</p>
                      <p className="text-xs text-gray-500">Há 5 minutos</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm font-medium">Pagamento confirmado</p>
                      <p className="text-xs text-gray-500">Há 2 horas</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t">
                    <Link to="/notifications" className="text-sm text-go3-primary hover:text-go3-accent">
                      Ver todas
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-go3-primary rounded-full flex items-center justify-center text-white">
                  {user?.name?.[0] || 'U'}
                </div>
                <ChevronDown size={16} className="text-go3-primary" />
              </button>

              {/* Dropdown menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-20">
                  <div className="px-4 py-3 border-b">
                    <p className="font-medium text-go3-primary">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link to="/account" className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                      <User size={16} className="mr-2" />
                      Minha Conta
                    </Link>
                    
                    {isAdmin && (
                      <Link to="/admin/partners" className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                        <Users size={16} className="mr-2" />
                        Gestão de Parceiros
                      </Link>
                    )}
                    
                    <Link to={isAdmin ? "/admin/transactions" : "/partner/transactions"} className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                      <CreditCard size={16} className="mr-2" />
                      Transações
                    </Link>
                    
                    <Link to="/reports" className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                      <BarChart3 size={16} className="mr-2" />
                      Relatórios
                    </Link>
                    
                    <Link to="/documents" className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                      <FileText size={16} className="mr-2" />
                      Documentos
                    </Link>
                    
                    <Link to="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
                      <Settings size={16} className="mr-2" />
                      Configurações
                    </Link>
                  </div>
                  
                  <div className="py-1 border-t">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
