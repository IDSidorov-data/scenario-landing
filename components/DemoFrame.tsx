"use client";

import { useState, useEffect } from 'react';
import { PRESETS } from '@/lib/constants'; // FIX: Импорт констант из отдельного файла.

export default function DemoFrame() {
  const [isLoading, setIsLoading] = useState(true);
  const [activePreset, setActivePreset] = useState(PRESETS[0].id);
  const [iframeSrc, setIframeSrc] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_STREAMLIT_URL || 'https://mock-streamlit-app.dev';

  useEffect(() => {
    setIsLoading(true);
    setIframeSrc(`${baseUrl}?preset=${activePreset}`);
  }, [activePreset, baseUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    // FIX: Добавлен комментарий, объясняющий важность этой строки для E2E-тестов.
    // Этот dispatch критически важен для E2E-теста (tests/e2e/demo.spec.ts), не удалять.
    window.dispatchEvent(new CustomEvent('demo_loaded', { detail: { preset: activePreset } }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-center items-center gap-2 mb-4 flex-wrap">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setActivePreset(preset.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activePreset === preset.id
                ? 'bg-brand-accent text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {preset.name}
          </button>
        ))}
        <a
          href={iframeSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 text-white hover:bg-gray-700"
        >
          Открыть в новой вкладке
        </a>
      </div>
      <div className="aspect-video w-full relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <p className="text-gray-500">Загрузка демо...</p>
          </div>
        )}
        <iframe
          src={iframeSrc}
          onLoad={handleLoad}
          title="Интерактивная демонстрация"
          className={`w-full h-full rounded-lg ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
