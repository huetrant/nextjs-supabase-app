import { getRequestConfig } from 'next-intl/server';
import { routing } from './i18n/routing';

export default getRequestConfig(async ({ locale }) => {
  // Use default locale if locale is undefined
  const validLocale = locale || routing.defaultLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(validLocale as any)) {
    throw new Error(`Invalid locale: ${validLocale}`);
  }

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});