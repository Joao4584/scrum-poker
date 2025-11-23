export const defaultLocale = 'pt-br'
export const locales = [defaultLocale, 'en-us'] as const

export const localesObject = {
  'pt-br': {
    icon: '🇧🇷',
    name: 'Português (BR)',
    slug: 'pt-br',
  },
  'en-us': {
    icon: '🇺🇸',
    name: 'English - (US)',
    slug: 'en-us',
  },
}
