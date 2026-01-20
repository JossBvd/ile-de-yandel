'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-16 px-8 text-center">
        <div className="space-y-8">
          <div className="text-6xl mb-6">🏝️</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            L'île de Yandel
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Escape game éducatif interactif pour les élèves de 6ᵉ et 5ᵉ
          </p>
          <div className="space-y-4">
            <Button
              size="lg"
              onClick={() => router.push('/game')}
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
            >
              Commencer l'aventure
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
