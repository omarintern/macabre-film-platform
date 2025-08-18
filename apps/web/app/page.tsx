export default function Home() {
  return (
    <div className="px-4">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Film Collaboration Platform
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          A professional, streamlined platform for screenplay writers to showcase their work
          and connect with producers and directors.
        </p>
        <div className="space-x-4">
          <a
            href="/spaces"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            Browse Spaces
          </a>
          <a
            href="/index"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Explore Index
          </a>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">For Writers</h3>
          <p className="text-gray-600">
            Showcase your work with concise, impactful storytelling through our 1000-character limit format.
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">For Producers</h3>
          <p className="text-gray-600">
            Discover high-quality synopsis writers and commission custom scripts in one centralized marketplace.
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Network</h3>
          <p className="text-gray-600">
            Connect with the independent film community through our focused, minimalist platform.
          </p>
        </div>
      </div>
    </div>
  );
}