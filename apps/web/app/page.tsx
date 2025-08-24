import Link from 'next/link';
import { Button } from '../components/ui/design-system';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Film Collaboration Platform
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A professional platform for screenplay collaboration between writers, producers, and directors
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Content Cards - Using our actual planned structure */}
            <div className="card-orange p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">The Midnight Detective</h3>
              <p className="text-sm text-gray-600 mb-3">A noir thriller about a private investigator</p>
              <p className="text-xs text-gray-500 mb-3">by John Smith</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#thriller</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#noir</span>
              </div>
            </div>

            <div className="card-blue p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Echoes of Tomorrow</h3>
              <p className="text-sm text-gray-600 mb-3">A sci-fi drama exploring time travel consequences</p>
              <p className="text-xs text-gray-500 mb-3">by Sarah Johnson</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#scifi</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#drama</span>
              </div>
            </div>

            <div className="card-green p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">The Last Harvest</h3>
              <p className="text-sm text-gray-600 mb-3">A family drama set in rural America</p>
              <p className="text-xs text-gray-500 mb-3">by Michael Chen</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#drama</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#family</span>
              </div>
            </div>

            <div className="card-pink p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Urban Legends</h3>
              <p className="text-sm text-gray-600 mb-3">A horror anthology series concept</p>
              <p className="text-xs text-gray-500 mb-3">by Emily Rodriguez</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#horror</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#anthology</span>
              </div>
            </div>

            <div className="card-red p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">The Art of War</h3>
              <p className="text-sm text-gray-600 mb-3">A historical epic about ancient strategy</p>
              <p className="text-xs text-gray-500 mb-3">by David Kim</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#historical</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#epic</span>
              </div>
            </div>

            <div className="card-orange p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Dreams</h3>
              <p className="text-sm text-gray-600 mb-3">A cyberpunk romance in virtual reality</p>
              <p className="text-xs text-gray-500 mb-3">by Lisa Thompson</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#cyberpunk</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#romance</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}