import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">
        Chào mừng đến với ứng dụng Supabase
      </h1>
      <div className="flex gap-4">
        <Link
          href="/auth/login"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Đăng nhập
        </Link>
        <Link
          href="/auth/register"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Đăng ký
        </Link>
      </div>
    </div>
  );
}