export function getInitialLanguage(): string {
  if (typeof window === 'undefined') {
    return 'en';
  }

  return localStorage.getItem('preferredLanguage') || 
         navigator.language?.split('-')[0] || 
         'en';
} 