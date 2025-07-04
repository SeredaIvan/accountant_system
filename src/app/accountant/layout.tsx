import Link from "next/link";

export default function AccountantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Бухгалтерська панель</h1>
        <div >
          <Link
            href="/accountant/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Дашборд
          </Link>
          <Link
            href="/accountant/dishes/add"
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Додати страву
          </Link>
          <Link
            href="/accountant/product/add"
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Додати продукт
          </Link>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">{children}</div>
    </div>
  );
}
