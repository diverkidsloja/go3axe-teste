
import React, { useState } from 'react';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Link, Plus, ExternalLink, Eye, Settings } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { useToast } from '@/components/ui/use-toast';

// Mock Payment Links
const MOCK_PAYMENT_LINKS = [
  {
    id: 'link1',
    name: 'Plano Mensal GO3',
    description: 'Assinatura mensal da plataforma',
    value: 199.90,
    url: 'https://go3axepay.com/l/plano-mensal',
    active: true,
    createdAt: '2023-10-15T10:30:00.000Z',
    expiresAt: '2030-12-31T23:59:59.000Z',
    usageCount: 45
  },
  {
    id: 'link2',
    name: 'Consultoria Basic',
    description: 'Pacote de consultoria inicial',
    value: 1500.00,
    url: 'https://go3axepay.com/l/consultoria-basic',
    active: true,
    createdAt: '2023-11-20T14:15:00.000Z',
    expiresAt: '2030-12-31T23:59:59.000Z',
    usageCount: 12
  },
  {
    id: 'link3',
    name: 'Workshop Finanças',
    description: 'Workshop sobre controle financeiro',
    value: 750.00,
    url: 'https://go3axepay.com/l/workshop-financas',
    active: false,
    createdAt: '2024-01-05T09:45:00.000Z',
    expiresAt: '2024-04-30T23:59:59.000Z',
    usageCount: 8
  }
];

const AdminPaymentLinks: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentLinks, setPaymentLinks] = useState(MOCK_PAYMENT_LINKS);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [newLink, setNewLink] = useState({
    name: '',
    description: '',
    value: '',
    expiresAt: ''
  });

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado",
      description: "Link de pagamento copiado para a área de transferência"
    });
  };

  const handleCreateLink = () => {
    if (!newLink.name || !newLink.value) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Mock creation of a new link
    const link = {
      id: `link${Date.now()}`,
      name: newLink.name,
      description: newLink.description,
      value: parseFloat(newLink.value),
      url: `https://go3axepay.com/l/${newLink.name.toLowerCase().replace(/\s+/g, '-')}`,
      active: true,
      createdAt: new Date().toISOString(),
      expiresAt: newLink.expiresAt || '2030-12-31T23:59:59.000Z',
      usageCount: 0
    };

    setPaymentLinks([link, ...paymentLinks]);
    setIsCreatingLink(false);
    setNewLink({ name: '', description: '', value: '', expiresAt: '' });
    
    toast({
      title: "Link criado",
      description: "Seu link de pagamento foi criado com sucesso"
    });
  };

  return (
    <div className="min-h-screen bg-go3-light flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <PageTitle
          title="Links de Pagamento"
          subtitle="Crie e gerencie seus links de pagamento"
        />
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium font-oceanshore text-go3-primary">Seus Links de Pagamento</h3>
            <Button onClick={() => setIsCreatingLink(!isCreatingLink)}>
              <Plus className="mr-2 h-4 w-4" /> Criar Novo Link
            </Button>
          </div>

          {isCreatingLink && (
            <div className="mb-6 p-4 border rounded-lg">
              <h4 className="font-medium mb-4">Novo Link de Pagamento</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome <span className="text-red-500">*</span></label>
                  <input
                    className="go3-input w-full"
                    value={newLink.name}
                    onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                    placeholder="Ex: Plano Premium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Valor (R$) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    className="go3-input w-full"
                    value={newLink.value}
                    onChange={(e) => setNewLink({...newLink, value: e.target.value})}
                    placeholder="Ex: 199,90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <input
                    className="go3-input w-full"
                    value={newLink.description}
                    onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                    placeholder="Ex: Assinatura mensal do serviço"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Expiração</label>
                  <input
                    type="date"
                    className="go3-input w-full"
                    value={newLink.expiresAt.split('T')[0] || ''}
                    onChange={(e) => setNewLink({...newLink, expiresAt: `${e.target.value}T23:59:59.000Z`})}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsCreatingLink(false)}>Cancelar</Button>
                <Button onClick={handleCreateLink}>Criar Link</Button>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Acessos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">{link.name}</TableCell>
                    <TableCell>{link.description}</TableCell>
                    <TableCell>{formatCurrency(link.value)}</TableCell>
                    <TableCell>
                      <span className={`go3-badge ${link.active ? 'go3-badge-success' : 'go3-badge-error'}`}>
                        {link.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(link.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{link.usageCount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleCopyLink(link.url)}
                          title="Copiar link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Configurações">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPaymentLinks;
