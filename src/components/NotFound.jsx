import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="text-6xl mb-4">🌿</div>
      <h2 className="text-2xl font-light text-gray-900 mb-3">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Looks like this path has gone off‑trail. Let s get you back to
        nature‑friendly shopping.
      </p>
      <Link
        to="/"
        className="text-emerald-600 hover:text-emerald-800 font-medium"
      >
        Go back to Home
      </Link>
    </div>
  );
}
