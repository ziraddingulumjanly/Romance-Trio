export type Lang = 'en' | 'fr' | 'it' | 'es';
export type TargetLang = Exclude<Lang, 'en'>;
export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', speech: 'en-GB', color: 'ink' },
  { code: 'fr', label: 'French', flag: '🇫🇷', speech: 'fr-FR', color: 'blue' },
  { code: 'it', label: 'Italian', flag: '🇮🇹', speech: 'it-IT', color: 'green' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸', speech: 'es-ES', color: 'red' },
] as const;
export function speak(text:string,lang:Lang): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LANGUAGES.find(l => l.code === lang)?.speech ?? 'en-GB';
  u.rate = 0.84;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  return true;
}
export const fold = (s:string) => s.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
