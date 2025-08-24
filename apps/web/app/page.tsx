import Link from 'next/link';
import { Button } from '../components/ui/design-system';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Extracts
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Published synopses and scene descriptions from our community
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Content Cards */}
            <div className="card-orange p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">hhh</h3>
              <p className="text-sm text-gray-600 mb-3">monkey</p>
              <p className="text-xs text-gray-500 mb-3">by omar</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#action</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#mystery</span>
              </div>
            </div>

            <div className="card-red p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ff</h3>
              <p className="text-sm text-gray-600 mb-3">ff</p>
              <p className="text-xs text-gray-500 mb-3">by omar</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#horror</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#crime</span>
              </div>
            </div>

            <div className="card-orange p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">rr</h3>
              <p className="text-sm text-gray-600 mb-3">fff</p>
              <p className="text-xs text-gray-500 mb-3">by omar</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#action</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#crime</span>
              </div>
            </div>

            <div className="card-red p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">jj</h3>
              <p className="text-sm text-gray-600 mb-3">jjjj</p>
              <p className="text-xs text-gray-500 mb-3">by omar</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#horror</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#drama</span>
              </div>
            </div>

            <div className="card-green p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Player's Blues</h3>
              <p className="text-sm text-gray-600 mb-3">
                An precocious npc in an AI-video-game simulation believes itself to be different from other characters. He notices things about himself, his surroundings and wonders if anyone is like him. He attempts...
              </p>
              <p className="text-xs text-gray-500 mb-3">by omar</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#sci-fi</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#thriller</span>
              </div>
            </div>

            <div className="card-pink p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tin</h3>
              <p className="text-sm text-gray-600 mb-3">Is sus</p>
              <p className="text-xs text-gray-500 mb-3">by omar</p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">#romance</span>
              </div>
              <p className="text-sm font-medium text-green-600">$298</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}