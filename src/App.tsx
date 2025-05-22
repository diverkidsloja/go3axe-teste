
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PartnersManagement from "./pages/admin/PartnersManagement";
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import NewCharge from "./pages/partner/NewCharge";
import SubcontaAsaas from "./pages/admin/SubcontaAsaas";
import NotFound from "./pages/NotFound";

// New Pages
import AdminExtract from "./pages/admin/AdminExtract";
import PartnerExtract from "./pages/partner/PartnerExtract";
import AdminTransactions from "./pages/admin/AdminTransactions";
import PartnerTransactions from "./pages/partner/PartnerTransactions";
import AdminPaymentLinks from "./pages/admin/AdminPaymentLinks";
import PartnerPaymentLinks from "./pages/partner/PartnerPaymentLinks";
import AdminTransfer from "./pages/admin/AdminTransfer";
import PartnerTransfer from "./pages/partner/PartnerTransfer";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [] 
}: { 
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirecionar para a dashboard apropriada com base na função do usuário
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/partner/dashboard'} />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/partners" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PartnersManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/subconta" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SubcontaAsaas />
                </ProtectedRoute>
              } />

              <Route path="/admin/extract" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminExtract />
                </ProtectedRoute>
              } />

              <Route path="/admin/transactions" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminTransactions />
                </ProtectedRoute>
              } />

              <Route path="/admin/payment-links" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPaymentLinks />
                </ProtectedRoute>
              } />

              <Route path="/admin/transfer" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminTransfer />
                </ProtectedRoute>
              } />
              
              {/* Partner Routes */}
              <Route path="/partner/dashboard" element={
                <ProtectedRoute allowedRoles={['partner']}>
                  <PartnerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/partner/new-charge" element={
                <ProtectedRoute allowedRoles={['partner']}>
                  <NewCharge />
                </ProtectedRoute>
              } />

              <Route path="/partner/extract" element={
                <ProtectedRoute allowedRoles={['partner']}>
                  <PartnerExtract />
                </ProtectedRoute>
              } />

              <Route path="/partner/transactions" element={
                <ProtectedRoute allowedRoles={['partner']}>
                  <PartnerTransactions />
                </ProtectedRoute>
              } />

              <Route path="/partner/payment-links" element={
                <ProtectedRoute allowedRoles={['partner']}>
                  <PartnerPaymentLinks />
                </ProtectedRoute>
              } />

              <Route path="/partner/transfer" element={
                <ProtectedRoute allowedRoles={['partner']}>
                  <PartnerTransfer />
                </ProtectedRoute>
              } />
              
              {/* Redirects */}
              <Route path="/" element={<Navigate to="/login" />} />
              
              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
