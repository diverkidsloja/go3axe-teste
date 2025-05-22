
import React, { useState } from 'react';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '../../utils/format';
import { useToast } from '@/components/ui/use-toast';

const AdminTransfer: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [transferAmount, setTransferAmount] = useState('');
  const [bankData, setBankData] = useState({
    accountType: 'checking',
    bankCode: '',
    agency: '',
    account: '',
    accountDigit: '',
    documentType: 'cpf',
    documentNumber: '',
    name: '',
  });
  const [transferType, setTransferType] = useState('pix');
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState('cpf');

  // Mock balance data
  const availableBalance = 15780.45;
  
  const handleTransfer = () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Informe um valor válido para transferência",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(transferAmount) > availableBalance) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não possui saldo suficiente para esta transferência",
        variant: "destructive"
      });
      return;
    }

    if (transferType === 'pix') {
      if (!pixKey) {
        toast({
          title: "Chave PIX não informada",
          description: "Informe uma chave PIX válida",
          variant: "destructive"
        });
        return;
      }
    } else {
      // Validate TED data
      if (!bankData.bankCode || !bankData.agency || !bankData.account || !bankData.name || !bankData.documentNumber) {
        toast({
          title: "Dados bancários incompletos",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive"
        });
        return;
      }
    }

    // Mock transfer success
    toast({
      title: "Transferência iniciada",
      description: `Sua transferência de ${formatCurrency(parseFloat(transferAmount))} foi iniciada com sucesso.`,
    });

    // Reset form
    setTransferAmount('');
    setPixKey('');
    setBankData({
      accountType: 'checking',
      bankCode: '',
      agency: '',
      account: '',
      accountDigit: '',
      documentType: 'cpf',
      documentNumber: '',
      name: '',
    });
  };

  return (
    <div className="min-h-screen bg-go3-light flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <PageTitle
          title="Transferências"
          subtitle="Transfira valores da sua conta Go3AxePay"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-6 font-oceanshore text-go3-primary">Nova Transferência</h3>
              
              <div className="mb-6">
                <div className="flex border-b mb-4">
                  <button 
                    className={`pb-2 px-4 ${transferType === 'pix' ? 'border-b-2 border-go3-primary text-go3-primary font-medium' : 'text-go3-muted'}`}
                    onClick={() => setTransferType('pix')}
                  >
                    PIX
                  </button>
                  <button 
                    className={`pb-2 px-4 ${transferType === 'ted' ? 'border-b-2 border-go3-primary text-go3-primary font-medium' : 'text-go3-muted'}`}
                    onClick={() => setTransferType('ted')}
                  >
                    TED
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Valor para transferência <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-go3-muted">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      className="go3-input w-full pl-10"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
              
              {transferType === 'pix' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de chave <span className="text-red-500">*</span></label>
                    <select
                      className="go3-input w-full"
                      value={pixKeyType}
                      onChange={(e) => setPixKeyType(e.target.value)}
                    >
                      <option value="cpf">CPF</option>
                      <option value="cnpj">CNPJ</option>
                      <option value="email">Email</option>
                      <option value="phone">Telefone</option>
                      <option value="random">Chave aleatória</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Chave PIX <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="go3-input w-full"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      placeholder={
                        pixKeyType === 'cpf' ? '000.000.000-00' :
                        pixKeyType === 'cnpj' ? '00.000.000/0001-00' :
                        pixKeyType === 'email' ? 'email@exemplo.com' :
                        pixKeyType === 'phone' ? '(00) 00000-0000' :
                        'Chave aleatória'
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Banco <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="go3-input w-full"
                        value={bankData.bankCode}
                        onChange={(e) => setBankData({...bankData, bankCode: e.target.value})}
                        placeholder="Código do banco (ex: 260)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de conta <span className="text-red-500">*</span></label>
                      <select
                        className="go3-input w-full"
                        value={bankData.accountType}
                        onChange={(e) => setBankData({...bankData, accountType: e.target.value})}
                      >
                        <option value="checking">Conta Corrente</option>
                        <option value="savings">Poupança</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Agência <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="go3-input w-full"
                        value={bankData.agency}
                        onChange={(e) => setBankData({...bankData, agency: e.target.value})}
                        placeholder="Número da agência (sem dígito)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Conta <span className="text-red-500">*</span></label>
                      <div className="flex">
                        <input
                          type="text"
                          className="go3-input w-full rounded-r-none"
                          value={bankData.account}
                          onChange={(e) => setBankData({...bankData, account: e.target.value})}
                          placeholder="Número da conta"
                        />
                        <input
                          type="text"
                          className="go3-input w-16 rounded-l-none"
                          value={bankData.accountDigit}
                          onChange={(e) => setBankData({...bankData, accountDigit: e.target.value})}
                          placeholder="DV"
                          maxLength={1}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome do titular <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="go3-input w-full"
                      value={bankData.name}
                      onChange={(e) => setBankData({...bankData, name: e.target.value})}
                      placeholder="Nome completo do titular da conta"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de documento <span className="text-red-500">*</span></label>
                      <select
                        className="go3-input w-full"
                        value={bankData.documentType}
                        onChange={(e) => setBankData({...bankData, documentType: e.target.value})}
                      >
                        <option value="cpf">CPF</option>
                        <option value="cnpj">CNPJ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Número do documento <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="go3-input w-full"
                        value={bankData.documentNumber}
                        onChange={(e) => setBankData({...bankData, documentNumber: e.target.value})}
                        placeholder={bankData.documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0001-00'}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <Button 
                  className="w-full"
                  onClick={handleTransfer}
                  disabled={!transferAmount || parseFloat(transferAmount) <= 0}
                >
                  {transferType === 'pix' ? 'Transferir via PIX' : 'Transferir via TED'}
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4 font-oceanshore text-go3-primary">Resumo</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between py-2">
                    <span className="text-go3-muted">Saldo disponível</span>
                    <span className="font-medium">{formatCurrency(availableBalance)}</span>
                  </div>
                </div>
                
                {parseFloat(transferAmount) > 0 && (
                  <div>
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between py-2">
                        <span className="text-go3-muted">Valor da transferência</span>
                        <span className="font-medium">{formatCurrency(parseFloat(transferAmount) || 0)}</span>
                      </div>
                      
                      <div className="flex justify-between py-2">
                        <span className="text-go3-muted">Taxa da operação</span>
                        <span className="font-medium">R$ 0,00</span>
                      </div>
                      
                      <div className="flex justify-between py-2 font-medium">
                        <span>Saldo após transferência</span>
                        <span>{formatCurrency(availableBalance - (parseFloat(transferAmount) || 0))}</span>
                      </div>
                    </div>
                    
                    {parseFloat(transferAmount) > availableBalance && (
                      <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        Saldo insuficiente para esta transferência.
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-6 bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-go3-primary">
                    <strong>Dica:</strong> Transferências PIX são processadas imediatamente. Transferências TED podem levar até 1 dia útil.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTransfer;
