import { redirect } from '@/i18n/routing';

export default function RootPage() {
  // Redirect về locale mặc định 'vi'
  redirect({ href: '/', locale: 'vi' });
  return null;
}
