export default function ProductDetail() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center relative overflow-hidden group">
          <div className="text-8xl">🧥</div>
          <div className="absolute top-4 left-4 pill bg-brand-600 text-white">
            eco‑choice
          </div>
          <div className="absolute top-4 right-4 pill bg-green-600 text-white">
            verified
          </div>
          <div className="absolute bottom-4 left-4 pill bg-white/90 text-gray-700">
            📷 5 photos
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-light text-gray-900 mb-2 font-display">
            Product Title
          </h1>
          <p className="text-gray-600 mb-4">Excellent pre‑loved condition</p>
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-xl font-semibold text-gray-900">$00.00</span>
            <span className="text-sm text-gray-400 line-through">$00.00</span>
          </div>

          <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-emerald-800">
              Choosing this pre‑loved item saves resources and reduces CO₂ vs.
              buying new. Thank you for helping to keep fashion circular.
            </p>
          </div>

          <button className="brand-gradient text-white px-6 py-3 rounded-full transition-all">
            Add to Cart
          </button>

          <div className="mt-10">
            <h2 className="text-lg font-medium text-gray-900 mb-3 font-display">
              Sustainability
            </h2>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
              <li>Estimated CO₂ saved compared to new</li>
              <li>Kept out of landfill and in use longer</li>
              <li>Ships in minimal, plastic‑free packaging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
