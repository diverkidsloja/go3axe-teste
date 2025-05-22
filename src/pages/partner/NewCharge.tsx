
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '../../utils/format';

const NewCharge: React.FC = () => {
  const { user } = useAuth();
  const { createTransaction, getFees } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerDocument: '',
    amount: '',
    dueDate: '',
    description: '',
    transactionType: 'boleto',
  });
  
  const [step, setStep] = useState(1);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const calculateFees = () => {
    if (!user?.id || !formData.amount || !formData.transactionType) return { platformFee: 0, netAmount: 0 };
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) return { platformFee: 0, netAmount: 0 };
    
    const fees = getFees(user.id);
    const transactionFee = fees.find(f => f.transactionType === formData.transactionType);
    
    if (!transactionFee) return { platformFee: 0, netAmount: amount };
    
    const fixedFee = transactionFee.fixedAmount;
    const percentageFee = (amount * transactionFee.percentageAmount) / 100;
    const totalFee = fixedFee + percentageFee;
    
    return {
      platformFee: totalFee,
      netAmount: amount - totalFee,
    };
  };
  
  const { platformFee, netAmount } = calculateFees();
  
  const handleNextStep = () => {
    if (step === 1) {
      // Validate first step
      if (!formData.customerName || !formData.amount || !formData.transactionType || !formData.dueDate) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Preencha todos os campos obrigatórios.',
          variant: 'destructive',
        });
        return;
      }
      
      setStep(2);
    } else {
      handleCreateCharge();
    }
  };
  
  const handleCreateCharge = async () => {
    try {
      if (!user?.id) return;
      
      const amount = parseFloat(formData.amount);
      if (isNaN(amount)) {
        toast({
          title: 'Valor inválido',
          description: 'O valor informado é inválido.',
          variant: 'destructive',
        });
        return;
      }
      
      await createTransaction({
        partnerId: user.id,
        customerId: `customer_${Math.random().toString(36).substring(2, 9)}`,
        customerName: formData.customerName,
        amount,
        platformFee,
        transactionType: formData.transactionType as any,
        dueDate: formData.dueDate,
      });
      
      toast({
        title: 'Cobrança criada',
        description: 'Sua cobrança foi criada com sucesso.',
      });
      
      navigate('/partner/dashboard');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao criar a cobrança.',
        variant: 'destructive',
      });
    }
  };
  
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'boleto':
        return 'Boleto';
      case 'pix':
        return 'PIX';
      case 'credit_upfront':
        return 'Cartão de Crédito (à vista)';
      case 'credit_2_6':
        return 'Cartão de Crédito (2-6x)';
      case 'credit_7_12':
        return 'Cartão de Crédito (7-12x)';
      case 'debit':
        return 'Cartão de Débito';
      default:
        return type;
    }
  };
  
  return (
    <div className="min-h-screen bg-go3-light flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <PageTitle
          title="Nova Cobrança"
          subtitle="Crie uma nova cobrança para seu cliente"
        />
        
        <div className="max-w-3xl mx-auto">
          {/* Step indicators */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${step >= 1 ? 'bg-go3-primary text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-go3-primary' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${step >= 2 ? 'bg-go3-primary text-white' : 'bg-gray-200'}`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium">Informações da cobrança</span>
              <span className="text-sm font-medium">Revisão e confirmação</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome do Cliente <span className="text-red-500">*</span></label>
                    <input
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="go3-input w-full"
                      placeholder="Nome do cliente"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email do Cliente</label>
                    <input
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="go3-input w-full"
                      placeholder="email@cliente.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">CPF/CNPJ do Cliente</label>
                    <input
                      name="customerDocument"
                      value={formData.customerDocument}
                      onChange={handleInputChange}
                      className="go3-input w-full"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Valor <span className="text-red-500">*</span></label>
                    <input
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="go3-input w-full"
                      placeholder="0,00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Data de Vencimento <span className="text-red-500">*</span></label>
                    <input
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="go3-input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Forma de Pagamento <span className="text-red-500">*</span></label>
                    <select
                      name="transactionType"
                      value={formData.transactionType}
                      onChange={handleInputChange}
                      className="go3-input w-full"
                    >
                      <option value="boleto">Boleto</option>
                      <option value="pix">PIX</option>
                      <option value="credit_upfront">Cartão de Crédito (à vista)</option>
                      <option value="credit_2_6">Cartão de Crédito (2-6x)</option>
                      <option value="credit_7_12">Cartão de Crédito (7-12x)</option>
                      <option value="debit">Cartão de Débito</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="go3-input w-full resize-none"
                    rows={3}
                    placeholder="Descreva o motivo da cobrança"
                  ></textarea>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Revise os dados da cobrança</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-go3-muted">Cliente:</p>
                    <p className="font-medium">{formData.customerName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-go3-muted">Email:</p>
                    <p className="font-medium">{formData.customerEmail || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-go3-muted">CPF/CNPJ:</p>
                    <p className="font-medium">{formData.customerDocument || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-go3-muted">Data de Vencimento:</p>
                    <p className="font-medium">{new Date(formData.dueDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-go3-muted">Forma de Pagamento:</p>
                    <p className="font-medium">{getTransactionTypeLabel(formData.transactionType)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-go3-muted">Descrição:</p>
                    <p className="font-medium">{formData.description || '-'}</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Valor Total para seu Cliente Final:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(formData.amount) || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-go3-muted">
                    <span className="text-sm">Taxa de Plataforma Go3AxePay (retida):</span>
                    <span className="font-medium">{formatCurrency(platformFee)}</span>
                  </div>
                  <div className="text-xs text-go3-muted mb-4">
                    Lembrete: Suas taxas de processamento ASAAS serão aplicadas pela ASAAS em sua conta.
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Seu Valor Líquido Estimado:</span>
                    <span className="font-bold text-lg">{formatCurrency(netAmount)}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-end space-x-3">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
              )}
              
              <button
                onClick={handleNextStep}
                className="go3-btn-primary"
              >
                {step === 1 ? 'Continuar' : 'Criar Cobrança'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewCharge;
