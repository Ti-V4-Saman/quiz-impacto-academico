export const PHONE_COUNTRIES = {
  BR: {
    code: 'BR',
    label: 'Brasil',
    shortLabel: 'BR',
    ddi: '+55',
    flag: '🇧🇷',
    placeholder: '(11) 99999-9999',
    help: 'Número brasileiro com DDD',
    min: 10,
    max: 11,
    autocomplete: 'tel-national'
  },
  US: {
    code: 'US',
    label: 'Estados Unidos',
    shortLabel: 'EUA',
    ddi: '+1',
    flag: '🇺🇸',
    placeholder: '(407) 555-0123',
    help: 'Número dos EUA com 10 dígitos',
    min: 10,
    max: 10,
    autocomplete: 'tel-national'
  },
  CA: {
    code: 'CA',
    label: 'Canadá',
    shortLabel: 'CA',
    ddi: '+1',
    flag: '🇨🇦',
    placeholder: '(416) 555-0123',
    help: 'Número do Canadá com 10 dígitos',
    min: 10,
    max: 10,
    autocomplete: 'tel-national'
  },
  GB: {
    code: 'GB',
    label: 'Inglaterra',
    shortLabel: 'UK',
    ddi: '+44',
    flag: '🇬🇧',
    placeholder: '7123 456789',
    help: 'Número da Inglaterra',
    min: 9,
    max: 10,
    autocomplete: 'tel-national'
  },
  FR: {
    code: 'FR',
    label: 'França',
    shortLabel: 'FR',
    ddi: '+33',
    flag: '🇫🇷',
    placeholder: '612 345 678',
    help: 'Número da França',
    min: 9,
    max: 9,
    autocomplete: 'tel-national'
  },
  OTHER: {
    code: 'OTHER',
    label: 'Outro',
    shortLabel: 'Outro',
    ddi: '',
    flag: '🌍',
    placeholder: 'Ex.: +44 7123 456789',
    help: 'Se escolher Outro, informe o número com o DDI do país.',
    min: 8,
    max: 15,
    autocomplete: 'tel'
  }
};

export function getPhoneCountryConfig(country = 'BR') {
  return PHONE_COUNTRIES[country] || PHONE_COUNTRIES.BR;
}

export function maskPhone(value, country = 'BR') {
  if (country === 'US' || country === 'CA') return maskUsPhone(value);
  if (country === 'BR') return maskBrazilianPhone(value);
  return maskGenericInternationalPhone(value, country);
}

export function maskBrazilianPhone(value) {
  let digits = onlyDigits(value);
  if (digits.startsWith('55') && digits.length > 11) digits = digits.slice(2);
  digits = digits.slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskUsPhone(value) {
  let digits = onlyDigits(value);
  if (digits.startsWith('1') && digits.length > 10) digits = digits.slice(1);
  digits = digits.slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function maskGenericInternationalPhone(value, country = 'GB') {
  const config = getPhoneCountryConfig(country);
  let digits = onlyDigits(value);
  const ddiDigits = onlyDigits(config.ddi);

  if (ddiDigits && digits.startsWith(ddiDigits) && digits.length > config.max) {
    digits = digits.slice(ddiDigits.length);
  }

  digits = digits.slice(0, config.max);

  if (country === 'OTHER') {
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 11) return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)} ${digits.slice(9)}`;
  }

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

export function getLocalPhoneDigits(value, country = 'BR') {
  const config = getPhoneCountryConfig(country);
  let digits = onlyDigits(value);
  const ddiDigits = onlyDigits(config.ddi);

  if (ddiDigits && digits.startsWith(ddiDigits) && digits.length > config.max) {
    digits = digits.slice(ddiDigits.length);
  }

  return digits.slice(0, config.max);
}

export function normalizePhone(value, country = 'BR') {
  const config = getPhoneCountryConfig(country);
  const localDigits = getLocalPhoneDigits(value, config.code);
  const ddiDigits = onlyDigits(config.ddi);
  if (!localDigits) return '';
  return ddiDigits ? `${ddiDigits}${localDigits}` : localDigits;
}

export function isValidPhone(value, country = 'BR') {
  const config = getPhoneCountryConfig(country);
  const digits = getLocalPhoneDigits(value, config.code);
  return digits.length >= config.min && digits.length <= config.max;
}

export function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}
