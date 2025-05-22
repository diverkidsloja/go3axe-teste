
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/partner/dashboard');
      }
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-go3-light">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-go3-primary">Go3AxePay</h1>
        <p className="text-xl text-go3-muted">Redirecionando...</p>
      </div>
    </div>
  );
};

export default Index;
