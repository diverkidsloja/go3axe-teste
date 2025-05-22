
import React, { useState } from 'react';
import { Plus, Edit, ToggleLeft, Settings } from 'lucide-react';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import { useData } from '../../contexts/DataContext';
import { Partner } from '../../types';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PartnersManagement: React.FC = () => {
  const { partners, addPartner, updatePartner, togglePartnerStatus } = useData();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFeeDialogOpen, setIsFeeDialogOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Partner>>({
    companyName: '',
    responsibleName: '',
    email: '',
    document: '',
    phone: '',
    apiKey: '',
    walletId: '',
  });
  
  const selectedPartner = selectedPartnerId 
    ? partners.find(p => p.id === selectedPartnerId) 
    : null;
  
  const handleOpenAddDialog = () => {
    setFormData({
      companyName: '',
      responsibleName: '',
      email: '',
      document: '',
      phone: '',
      apiKey: '',
      walletId: '',
    });
    setIsAddDialogOpen(true);
  };
  
  const handleOpenEditDialog = (partner: Partner) => {
    setSelectedPartnerId(partner.id);
    setFormData({
      companyName: partner.companyName,
      responsibleName: partner.responsibleName,
      email: partner.email,
      document: partner.document,
      phone: partner.phone,
      apiKey: partner.apiKey,
      walletId: partner.walletId,
    });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenFeeDialog = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setIsFeeDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddPartner = async () => {
    try {
      if (!formData.companyName || !formData.email || !formData.apiKey) {
        toast({
          title: 'Erro',
          description: 'Preencha todos os campos obrigatórios.',
          variant: 'destructive',
        });
        return;
      }
      
      await addPartner({
        companyName: formData.companyName || '',
        responsibleName: formData.responsibleName || '',
        email: formData.email || '',
        document: formData.document || '',
        phone: formData.phone || '',
        apiKey: formData.apiKey || '',
        walletId: formData.walletId || '',
        name: formData.responsibleName || '',
        isActive: true,
      });
      
      setIsAddDialogOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Parceiro adicionado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao adicionar parceiro.',
        variant: 'destructive',
      });
    }
  };
  
  const handleEditPartner = async () => {
    try {
      if (!selectedPartnerId) return;
      
      await updatePartner(selectedPartnerId, formData);
      
      setIsEditDialogOpen(false);
      toast({
        title: 'Sucesso',
        description: 'Parceiro atualizado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar parceiro.',
        variant: 'destructive',
      });
    }
  };
  
  const handleToggleStatus = async (partnerId: string) => {
    try {
      await togglePartnerStatus(partnerId);
      toast({
        title: 'Sucesso',
        description: 'Status do parceiro atualizado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar status do parceiro.',
        variant: 'destructive',
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-go3-light flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <PageTitle
          title="Gestão de Parceiros da Go3AxePay"
          subtitle="Gerencie seus parceiros e suas taxas"
          actions={
            <Button onClick={handleOpenAddDialog} className="bg-go3-primary text-white hover:bg-go3-primary/90">
              <Plus size={16} className="mr-2" /> Novo Parceiro
            </Button>
          }
        />
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="go3-table">
              <thead className="bg-gray-50">
                <tr>
                  <th>Nome</th>
                  <th>Responsável</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Data Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {partners.map((partner) => (
                  <tr key={partner.id}>
                    <td className="py-4 px-6">
                      <div className="font-medium">{partner.companyName}</div>
                    </td>
                    <td className="py-4 px-6">
                      {partner.responsibleName}
                    </td>
                    <td className="py-4 px-6">
                      {partner.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`go3-badge ${partner.isActive ? 'go3-badge-success' : 'go3-badge-error'}`}>
                        {partner.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {formatDate(partner.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenEditDialog(partner)}
                          className="p-1 rounded hover:bg-gray-100"
                          title="Editar Cadastro"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(partner.id)}
                          className="p-1 rounded hover:bg-gray-100"
                          title={partner.isActive ? 'Desativar' : 'Ativar'}
                        >
                          <ToggleLeft size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenFeeDialog(partner.id)}
                          className="p-1 rounded hover:bg-gray-100"
                          title="Definir Taxas"
                        >
                          <Settings size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      {/* Dialog for adding a new partner */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Novo Parceiro</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome da Empresa/Parceiro</label>
                  <input
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Responsável</label>
                  <input
                    name="responsibleName"
                    value={formData.responsibleName || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email (login do parceiro)</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">CPF/CNPJ</label>
                  <input
                    name="document"
                    value={formData.document || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <input
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">API Key ASAAS</label>
                  <input
                    name="apiKey"
                    value={formData.apiKey || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Wallet ID ASAAS</label>
                  <input
                    name="walletId"
                    value={formData.walletId || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddPartner}
                  className="go3-btn-primary"
                >
                  Adicionar Parceiro
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      
      {/* Dialog for editing a partner */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Editar Parceiro</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome da Empresa/Parceiro</label>
                  <input
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Responsável</label>
                  <input
                    name="responsibleName"
                    value={formData.responsibleName || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email (login do parceiro)</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">CPF/CNPJ</label>
                  <input
                    name="document"
                    value={formData.document || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <input
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">API Key ASAAS</label>
                  <input
                    name="apiKey"
                    value={formData.apiKey || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Wallet ID ASAAS</label>
                  <input
                    name="walletId"
                    value={formData.walletId || ''}
                    onChange={handleInputChange}
                    className="go3-input w-full"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditPartner}
                  className="go3-btn-primary"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      
      {/* Dialog for setting fees */}
      <Dialog open={isFeeDialogOpen} onOpenChange={setIsFeeDialogOpen}>
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Definir Taxas Go3AxePay para {selectedPartner?.companyName}
              </h2>
              
              <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-go3-muted mb-2">Wallet ID para receber o overprice:</div>
                <div className="font-medium">wallet_asaas_gustavo123</div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Boleto</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Taxa Fixa (R$)</label>
                        <input className="go3-input w-full" defaultValue="2.50" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Taxa Percentual (%)</label>
                        <input className="go3-input w-full" defaultValue="1.5" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">PIX</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Taxa Fixa (R$)</label>
                        <input className="go3-input w-full" defaultValue="1.00" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Taxa Percentual (%)</label>
                        <input className="go3-input w-full" defaultValue="1.0" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Cartão Crédito (à vista)</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Taxa Fixa (R$)</label>
                        <input className="go3-input w-full" defaultValue="0.00" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Taxa Percentual (%)</label>
                        <input className="go3-input w-full" defaultValue="3.0" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Cartão Crédito (2-6x)</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Taxa Fixa (R$)</label>
                        <input className="go3-input w-full" defaultValue="0.00" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Taxa Percentual (%)</label>
                        <input className="go3-input w-full" defaultValue="4.5" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Cartão Crédito (7-12x)</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Taxa Fixa (R$)</label>
                        <input className="go3-input w-full" defaultValue="0.00" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Taxa Percentual (%)</label>
                        <input className="go3-input w-full" defaultValue="6.0" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Débito</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Taxa Fixa (R$)</label>
                        <input className="go3-input w-full" defaultValue="0.00" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Taxa Percentual (%)</label>
                        <input className="go3-input w-full" defaultValue="2.0" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-go3-muted bg-gray-50 p-3 rounded">
                  Observação: Estas taxas representam o overprice da Go3AxePay que será aplicado sobre as transações
                  deste parceiro. O parceiro também pagará as taxas normais da ASAAS em sua própria conta.
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsFeeDialogOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setIsFeeDialogOpen(false);
                    toast({
                      title: 'Sucesso',
                      description: 'Taxas atualizadas com sucesso.',
                    });
                  }}
                  className="go3-btn-primary"
                >
                  Salvar Taxas
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PartnersManagement;
