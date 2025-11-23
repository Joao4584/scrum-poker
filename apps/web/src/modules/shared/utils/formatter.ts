export const formatCurrencyBRL = (value: number | undefined): string => {
  if (value === undefined) return '';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function formatPhoneNumber(phoneNumber: string | undefined): string {
  if (!phoneNumber) return '';
  
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}

export function formatPlate(plate: string | undefined): string {
  if (!plate) return '';
  return plate.replace(/^([A-Z]{3})(\d{1}[A-Z]|\d{2})(\d{2})$/, '$1-$2$3');
}

export function formatCNPJ(cnpj: string | undefined): string {
  if (!cnpj) return '';
  
  const cleaned = cnpj.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
  }
  return cnpj;
}

export function formatCPF(cpf: string | undefined): string {
  if (!cpf) return '';
  
  const cleaned = cpf.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cpf;
}