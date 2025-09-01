import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Macabre
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            A professional platform for screenplay collaboration between writers, producers, and directors
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sample Content Cards - Rectangular layout with content-relative sizing */}
            <div className="card-orange p-8 border-l-4 border-orange-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The Midnight Detective</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                A noir thriller about a private investigator who discovers a conspiracy that goes deeper than he imagined. 
                Set in a rain-soaked city where every shadow hides a secret.
              </p>
              <p className="text-sm text-gray-600 mb-4">by John Smith</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full">#thriller</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full">#noir</span>
              </div>
            </div>

            <div className="card-blue p-8 border-l-4 border-blue-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Echoes of Tomorrow</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                A sci-fi drama exploring the consequences of time travel. When a scientist discovers how to send messages 
                to the past, the present begins to unravel in unexpected ways.
              </p>
              <p className="text-sm text-gray-600 mb-4">by Sarah Johnson</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">#scifi</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">#drama</span>
              </div>
            </div>

            <div className="card-green p-8 border-l-4 border-green-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The Last Harvest</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                A family drama set in rural America during the Dust Bowl. Three generations struggle to hold onto their 
                farm and their relationships as the world around them changes forever.
              </p>
              <p className="text-sm text-gray-600 mb-4">by Michael Chen</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">#drama</span>
                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">#family</span>
              </div>
            </div>

            <div className="card-pink p-8 border-l-4 border-pink-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Urban Legends</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                A horror anthology series concept where each episode explores a different urban legend from around the world. 
                From ghost stories to cryptid encounters, every tale reveals something about human nature.
              </p>
              <p className="text-sm text-gray-600 mb-4">by Emily Rodriguez</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-pink-100 text-pink-800 px-3 py-1 rounded-full">#horror</span>
                <span className="text-xs bg-pink-100 text-pink-800 px-3 py-1 rounded-full">#anthology</span>
              </div>
            </div>

            <div className="card-red p-8 border-l-4 border-red-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The Art of War</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                A historical epic about ancient strategy and the rise of a military genius. Set against the backdrop of 
                warring kingdoms, this story explores the price of ambition and the cost of victory.
              </p>
              <p className="text-sm text-gray-600 mb-4">by David Kim</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full">#historical</span>
                <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full">#epic</span>
              </div>
            </div>

            <div className="card-orange p-8 border-l-4 border-orange-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Digital Dreams</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                A cyberpunk romance set in a virtual reality world where the boundaries between digital and real love 
                become blurred. When two users fall in love online, they must decide if their connection can survive in reality.
              </p>
              <p className="text-sm text-gray-600 mb-4">by Lisa Thompson</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full">#cyberpunk</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full">#romance</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}