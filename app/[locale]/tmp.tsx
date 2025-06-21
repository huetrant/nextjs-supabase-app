import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function HomePage() {
  const t = useTranslations('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          {t('title')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('title')}</h2>
            <p className="text-gray-600">{t('subtitle')}</p>
          </Link>

          <Link href="/products" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Products</h2>
            <p className="text-gray-600">Manage your products</p>
          </Link>

          <Link href="/orders" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Orders</h2>
            <p className="text-gray-600">View and manage orders</p>
          </Link>

          <Link href="/customers" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Customers</h2>
            <p className="text-gray-600">Manage customer information</p>
          </Link>

          <Link href="/categories" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Categories</h2>
            <p className="text-gray-600">Organize product categories</p>
          </Link>

          <Link href="/stores" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Stores</h2>
            <p className="text-gray-600">Manage store locations</p>
          </Link>
        </div>
      </div>
    </div>
  );
}