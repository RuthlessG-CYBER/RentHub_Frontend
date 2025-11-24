export const About = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">

        <div className="mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            About <span className="text-blue-600">RentHub</span>
          </h2>
          <p className="text-slate-500 mt-2 max-w-2xl">
            A modern and transparent approach to finding the perfect rental home.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <p className="text-slate-600 leading-relaxed">
              RentHub was created to simplify renting for both tenants and landlords.
              Our goal is to make the experience smooth, transparent, and trustworthy
              through verified listings and modern tools.
            </p>

            <p className="text-slate-600 leading-relaxed">
              We provide a reliable platform with fast communication, secure
              booking management, and a seamless user interface that allows
              you to find the right home effortlessly.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Verified Listings
              </span>
              <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Secure Platform
              </span>
              <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Hassle-Free Renting
              </span>
              <span className="px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                Smart Experience
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">

            <div className="col-span-2 rounded-2xl overflow-hidden border shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
                alt="RentHub Visual 1"
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="rounded-2xl overflow-hidden border shadow-sm">
              <img
                src="https://i.pinimg.com/736x/4c/70/25/4c7025db392a3fb6cd34e67d4b442332.jpg"
                alt="RentHub Visual 2"
                className="w-full h-56 object-cover"
              />
            </div>

            <div className="rounded-2xl overflow-hidden border shadow-sm">
              <img
                src="https://i.pinimg.com/1200x/7b/e6/a5/7be6a53e725918bd67c6de20d878516b.jpg"
                alt="RentHub Visual 3"
                className="w-full h-56 object-cover"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
