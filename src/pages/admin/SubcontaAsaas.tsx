
import React, { useState } from 'react';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import { useToast } from '@/components/ui/use-toast';

interface SubcontaFormData {
  nome: string;
  email: string;
  cpfCnpj: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

const SubcontaAsaas: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SubcontaFormData>({
    nome: '',
    email: '',
    cpfCnpj: '',
    telefone: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey) {
      toast({
        title: "Erro",
        description: "Por favor, informe a chave API do Asaas",
        variant: "destructive",
      });
      return;
    }

    if (!formData.nome || !formData.email || !formData.cpfCnpj) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Esta é a estrutura para criar uma subconta no Asaas via API
      const payload = {
        name: formData.nome,
        email: formData.email,
        cpfCnpj: formData.cpfCnpj,
        companyType: "MEI", // Tipo padrão, pode ser alterado conforme necessidade
        phone: formData.telefone,
        mobilePhone: formData.telefone,
        address: formData.endereco,
        addressNumber: formData.numero,
        complement: formData.complemento,
        province: formData.bairro,
        city: formData.cidade,
        state: formData.estado,
        postalCode: formData.cep,
        apiKey: apiKey
      };

      // Simulação de chamada API - em produção, esta seria uma chamada real ao Asaas
      console.log("Enviando dados para API Asaas:", payload);
      
      // Simula um delay de resposta da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Sucesso",
        description: `Subconta para ${formData.nome} criada com sucesso!`,
      });
      
      // Limpar formulário após sucesso
      setFormData({
        nome: '',
        email: '',
        cpfCnpj: '',
        telefone: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      });
      
    } catch (error) {
      console.error("Erro ao criar subconta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a subconta. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-go3-light flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <PageTitle
          title="Cadastro de Subconta Asaas"
          subtitle="Crie subcontas para seus parceiros via API do Asaas"
        />
        
        <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-go3-light p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2 text-go3-primary">Chave API do Asaas</h3>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="go3-input w-full"
                placeholder="$aas_..."
              />
              <p className="text-xs text-go3-muted mt-1">
                A chave API é necessária para autenticar a requisição com o Asaas.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Nome <span className="text-red-500">*</span></label>
                <input
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="go3-input w-full"
                  placeholder="Nome da subconta"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="go3-input w-full"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">CPF/CNPJ <span className="text-red-500">*</span></label>
                <input
                  name="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={handleInputChange}
                  className="go3-input w-full"
                  placeholder="Apenas números"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="go3-input w-full"
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">CEP</label>
                <input
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  className="go3-input w-full"
                  placeholder="00000-000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Endereço</label>
                <input
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className="go3-input w-full"
                  placeholder="Rua, Avenida, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Número</label>
                <input
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  className="go3-input w-full"
                  placeholder="123"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Complemento</label>
                <input
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                  className="go3-input w-full"
                  placeholder="Apto, Sala, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bairro</label>
                <input
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  className="go3-input w-full"
                  placeholder="Bairro"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cidade</label>
                <input
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  className="go3-input w-full"
                  placeholder="Cidade"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleSelectChange}
                  className="go3-input w-full"
                >
                  <option value="">Selecione...</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4 border-t flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="go3-btn-primary"
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar Subconta'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SubcontaAsaas;
