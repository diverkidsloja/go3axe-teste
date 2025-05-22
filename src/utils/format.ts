
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatCPFOrCNPJ = (value: string): string => {
  // CPF: 123.456.789-01
  if (value.length === 11) {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  // CNPJ: 12.345.678/0001-90
  if (value.length === 14) {
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return value;
};

export const formatPhone = (value: string): string => {
  // Remove non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // (71) 99999-9999
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  // (71) 9999-9999
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return value;
};

export const removeFormatting = (value: string): string => {
  return value.replace(/\D/g, '');
};
