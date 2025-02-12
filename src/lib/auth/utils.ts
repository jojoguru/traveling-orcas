const ALLOWED_DOMAINS = ['creepy-hd.de', 'brainbits.net']; // Add your allowed domains

export function isEmailDomainAllowed(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
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