export default function ProductDetail() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <div className="grid md:grid-cols-2 gap-16">
        <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden group">
          <div className="text-8xl">🧥</div>
          <div className="absolute top-6 left-6 bg-black text-white px-4 py-2 text-xs font-light">
            eco‑choice
          </div>
          <div className="absolute top-6 right-6 bg-black text-white px-4 py-2 text-xs font-light">
            verified
          </div>
          <div className="absolute bottom-6 left-6 bg-white/90 text-black px-4 py-2 text-xs font-light">
            📷 5 photos
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-light text-black mb-4">Product Title</h1>
          <p className="text-gray-600 mb-6 font-light">
            Excellent pre‑loved condition
          </p>
          <div className="flex items-center space-x-4 mb-8">
            <span className="text-xl font-light text-black">$00.00</span>
            <span className="text-sm text-gray-400 line-through font-light">
              $00.00
            </span>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
            <p className="text-sm text-black font-light">
              Choosing this pre‑loved item saves resources and reduces CO₂ vs.
              buying new. Thank you for helping to keep fashion circular.
            </p>
          </div>

          <button className="bg-black text-white px-8 py-4 transition-all font-light hover:bg-gray-900">
            Add to Cart
          </button>

          <div className="mt-12">
            <h2 className="text-lg font-light text-black mb-6">
              Sustainability
            </h2>
            <ul className="text-sm text-gray-600 space-y-3 list-disc pl-6 font-light">
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
