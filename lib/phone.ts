export function normalizePhone(value: string) {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return `${hasPlus ? "+" : ""}${digits}`;
}

export function isValidWhatsApp(value: string) {
  const phone = normalizePhone(value);
  return /^\+?\d{8,15}$/.test(phone);
}
