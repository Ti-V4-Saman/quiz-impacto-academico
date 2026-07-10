import { state } from '../state.js';
import { getPhoneCountryConfig, isValidPhone } from '../utils/phone.js';

export function validateField(field, value) {
  const cleanValue = String(value || '').trim();

  if (field === 'nome') {
    if (cleanValue.length < 3) return 'Digite seu nome completo.';
    if (cleanValue.split(/\s+/).length < 2) return 'Informe nome e sobrenome.';
    return '';
  }

  if (field === 'telefone') {
    const country = state.answers.telefone_pais || 'BR';
    const config = getPhoneCountryConfig(country);

    if (country === 'OTHER' && !cleanValue) {
      return 'Digite seu WhatsApp com o DDI do país.';
    }

    if (!isValidPhone(cleanValue, country)) {
      return country === 'US'
        ? 'Digite um WhatsApp válido dos Estados Unidos com 10 dígitos.'
        : country === 'BR'
          ? 'Digite um WhatsApp válido do Brasil com DDD.'
          : country === 'OTHER'
            ? 'Digite um WhatsApp válido com o DDI do país. Ex.: +44 7123 456789.'
            : `Digite um WhatsApp válido para ${config.label}.`;
    }

    if (!cleanValue) return config.ddi ? `Digite seu WhatsApp ${config.ddi}.` : 'Digite seu WhatsApp.';
    return '';
  }

  if (field === 'telefone_pais_outro') {
    if (cleanValue.length < 2) return 'Informe de qual país é esse WhatsApp.';
    return '';
  }

  if (field === 'email') {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue);
    return isValid ? '' : 'Digite um e-mail válido.';
  }

  if (field === 'nome_escola') {
    if (cleanValue.length < 2) return 'Informe o nome da escola ou uma referência.';
    return '';
  }

  if (field === 'localizacao_outro') {
    if (cleanValue.length < 2) return 'Informe de qual país vocês são.';
    return '';
  }

  return cleanValue ? '' : 'Preencha este campo para continuar.';
}
