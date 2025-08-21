import Link from 'next/link'; // FIX: Импортирован Link для клиентской навигации.

export default function Header() {
  return (
    <header className="bg-brand-primary">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 text-white font-bold text-xl">
            Scenario
          </Link>
        </div>
        <div className="lg:flex lg:flex-1 lg:justify-end">
          {/* FIX: Тег <a> заменен на <Link> для предотвращения перезагрузки страницы. */}
          <Link href="/demo" className="text-sm font-semibold leading-6 text-white">
            Запросить демо <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
