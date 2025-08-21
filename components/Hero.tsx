// MOCK
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Финансовый симулятор "Scenario"
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Принимайте взвешенные решения, моделируя будущее вашего бизнеса. Наш инструмент поможет вам проанализировать различные сценарии и выбрать оптимальный путь развития.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/demo"
              className="rounded-md bg-brand-accent px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              Начать работу
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}