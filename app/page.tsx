'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            Your AI Assistant,
            <span className="text-purple-400"> Always On</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Clawdbot remembers everything, works 24/7, and gets smarter over time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
            <div className="text-4xl font-bold text-purple-400 mb-4">$29<span className="text-lg text-gray-400">/mo</span></div>
            <a 
              href="/api/checkout?price=price_1SwtCbBfSldKMuDjM3p0kyG4"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold text-center"
            >
              Start Free Trial
            </a>
          </div>

          <div className="bg-purple-900/30 p-8 rounded-lg border-2 border-purple-500">
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <div className="text-4xl font-bold text-purple-400 mb-4">$79<span className="text-lg text-gray-400">/mo</span></div>
            <a 
              href="/api/checkout?price=price_1SwtCbBfSldKMuDjDmRHqErh"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold text-center"
            >
              Start Free Trial
            </a>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-2">Team</h3>
            <div className="text-4xl font-bold text-purple-400 mb-4">$199<span className="text-lg text-gray-400">/mo</span></div>
            <a 
              href="/api/checkout?price=price_1SwtCcBfSldKMuDjEKBqQ6lH"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold text-center"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
