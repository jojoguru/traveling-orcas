function getAllowedDomains(): string[] {
  const domainsString = process.env.ALLOWED_EMAIL_DOMAINS;
  if (!domainsString) {
    console.warn('ALLOWED_EMAIL_DOMAINS environment variable is not set. No email domains will be allowed.');
    return [];
  }
  return domainsString.split(',').map(domain => domain.trim().toLowerCase());
}

export function isEmailDomainAllowed(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  const allowedDomains = getAllowedDomains();
  
  if (allowedDomains.length === 0) {
    return false;
  }
  
  return allowedDomains.includes(domain);
}

export function generateAuthCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getEmailTemplate(code: string): {
  subject: string;
  html: string;
} {
  return {
    subject: 'Your Access Code for Traveling Orcas',
    html: `
      <h2>Your Access Code</h2>
      <p>Here is your verification code: <strong>${code}</strong></p>
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `,
  };
} 