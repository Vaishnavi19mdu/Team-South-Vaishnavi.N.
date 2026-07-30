export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^[0-9+\-\s()]{8,15}$/.test(phone);
}

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}
