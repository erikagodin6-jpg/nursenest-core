const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "mailinator.com",
  "maildrop.cc",
  "moakt.com",
  "sharklasers.com",
  "temp-mail.org",
  "tempmail.com",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
]);

const SUSPICIOUS_EMAIL_DOMAIN_PATTERNS = [/^temp-?mail\./i, /^10minute/i, /guerrilla/i, /throwaway/i, /trashmail/i];

export function emailDomain(email: string): string {
  const at = email.trim().toLowerCase().lastIndexOf("@");
  if (at < 0) return "";
  return email.trim().toLowerCase().slice(at + 1);
}

export function isDisposableEmailDomain(domainOrEmail: string): boolean {
  const domain = domainOrEmail.includes("@") ? emailDomain(domainOrEmail) : domainOrEmail.trim().toLowerCase();
  if (!domain) return false;
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) return true;
  return SUSPICIOUS_EMAIL_DOMAIN_PATTERNS.some((pattern) => pattern.test(domain));
}

export function disposableEmailDenylist(): readonly string[] {
  return [...DISPOSABLE_EMAIL_DOMAINS].sort();
}
