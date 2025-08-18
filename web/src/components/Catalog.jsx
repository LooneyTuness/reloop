export default function Catalog() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-8 py-16">
        <h2 className="text-2xl font-light tracking-wide text-black mb-8">
          Customers also purchased
        </h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative">
            <img
              src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg"
              alt="Front of men's Basic Tee in black."
              className="aspect-square w-full bg-gray-100 object-cover group-hover:opacity-90 transition-opacity duration-300"
            />
            <div className="mt-6 flex justify-between">
              <div>
                <h3 className="text-sm text-black font-light">
                  <a href="#">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                    ></span>
                    Basic Tee
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500 font-light">Black</p>
              </div>
              <p className="text-sm font-light text-black">$35</p>
            </div>
          </div>
          <div className="group relative">
            <img
              src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg"
              alt="Front of men's Basic Tee in white."
              className="aspect-square w-full bg-gray-100 object-cover group-hover:opacity-90 transition-opacity duration-300"
            />
            <div className="mt-6 flex justify-between">
              <div>
                <h3 className="text-sm text-black font-light">
                  <a href="#">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                    ></span>
                    Basic Tee
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500 font-light">
                  Aspen White
                </p>
              </div>
              <p className="text-sm font-light text-black">$35</p>
            </div>
          </div>
          <div className="group relative">
            <img
              src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg"
              alt="Front of men's Basic Tee in dark gray."
              className="aspect-square w-full bg-gray-100 object-cover group-hover:opacity-90 transition-opacity duration-300"
            />
            <div className="mt-6 flex justify-between">
              <div>
                <h3 className="text-sm text-black font-light">
                  <a href="#">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                    ></span>
                    Basic Tee
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500 font-light">
                  Charcoal
                </p>
              </div>
              <p className="text-sm font-light text-black">$35</p>
            </div>
          </div>
          <div className="group relative">
            <img
              src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg"
              alt="Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube."
              className="aspect-square w-full bg-gray-100 object-cover group-hover:opacity-90 transition-opacity duration-300"
            />
            <div className="mt-6 flex justify-between">
              <div>
                <h3 className="text-sm text-black font-light">
                  <a href="#">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                    ></span>
                    Artwork Tee
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500 font-light">
                  Iso Dots
                </p>
              </div>
              <p className="text-sm font-light text-black">$35</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
