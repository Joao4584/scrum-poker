import { createI18nServer } from 'next-international/server'

export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
  'en-us': () => import('./messages/en-us'),
  'pt-br': () => import('./messages/pt-br'),
})
