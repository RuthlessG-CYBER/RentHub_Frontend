import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Footer from "./footer";
import { Trash2, Edit, Search } from "lucide-react";
import ProfileDropdown from "@/components/profile";
import axios from "axios";
import { toast } from "react-toastify";
import { Contact } from "./contact";
import { About } from "./about";



// Types
export interface Product {
  _id: string;
  name: string;
  src: string;
  price: number;
  location: string;
  availability: boolean;
  ownerId: string;
}

type BookingData = {
  date: string;
  time: string;
};

type EditData = {
  _id: string;
  name: string;
  location: string;
  price: number;
  availability: boolean;
  src: string;
};

export default function Home() {

  const savedUser = localStorage.getItem("user");
  const currentUser = savedUser ? JSON.parse(savedUser) : null;
  // States for handeling data
  const [active, setActive] = useState<"home" | "listings" | "about" | "contact">(
    "home"
  );

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);

  const [productId, setProductId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    date: "",
    time: "",
  });
  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    availability: true,
    src: "",
  });
  const [editData, setEditData] = useState<EditData>({
    _id: "",
    name: "",
    location: "",
    price: 0,
    availability: true,
    src: "",
  });

  // For Search
  const handleSearch = () => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFilteredProducts([]);
      return;
    }

    const result = products.filter(
      (item) =>
        item.location.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q)
    );
    setFilteredProducts(result);
  };
  handleSearch();


  // For Booking
  const handleBookNow = (p: Product) => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("You must be logged in");
      return;
    }

    const user = JSON.parse(savedUser);

    if (p.ownerId === user.id) {
      toast.error("You cannot book your own property");
      return;
    }

    setBookingProduct(p);
    setBookingOpen(true);
  };

  const sendBooking = async () => {
    if (!bookingProduct) return;

    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;

    const user = JSON.parse(savedUser);

    const payload = {
      from: user.id,
      to: bookingProduct.ownerId,
      date: bookingData.date,
      time: bookingData.time,
      price: bookingProduct.price,
    };

    try {
      await axios.post(
        `https://renthub-backend-h0ot.onrender.com/api/user/bookings/${bookingProduct.ownerId}`,
        payload
      );

      toast.success("Booking request sent!");
      setBookingOpen(false);
      setBookingData({ date: "", time: "" });
    } catch (error) {
      console.error(error);
      toast.error("Booking failed!");
    }
  };

  // For Edit the card
  const handleEdit = (p: Product) => {
    setEditData({
      _id: p._id,
      name: p.name,
      price: p.price,
      location: p.location,
      availability: p.availability,
      src: p.src,
    });

    setProductId(p._id);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editData || !productId) return;

    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        console.log("User not logged in");
        return;
      }
      const user = JSON.parse(savedUser);
      const userId = user.id;

      const res = await axios.put(
        `https://renthub-backend-h0ot.onrender.com/api/user/${userId}/products/${productId}`,
        editData
      );

      console.log("UPDATE SUCCESS:", res.data);

      setProducts((prev) =>
        prev.map((item) =>
          item._id === productId ? { ...item, ...editData } : item
        )
      );

      setMyProducts((prev) =>
        prev.map((item) =>
          item._id === productId ? { ...item, ...editData } : item
        )
      );

      setEditOpen(false);
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Update failed");
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        console.log("User not logged in");
        return;
      }

      const user = JSON.parse(savedUser);
      const userId = user.id;

      await axios.delete(
        `https://renthub-backend-h0ot.onrender.com/api/user/${userId}/products/${id}`
      );

      setProducts((prev) => prev.filter((item) => item._id !== id));
      setMyProducts((prev) => prev.filter((item) => item._id !== id));

      toast.success("Property deleted!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete");
    }
  };

  // For Add Property
  const handleAddProperty = async () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        console.log("User not logged in");
        return;
      }

      const user = JSON.parse(savedUser);
      const userId = user.id;

      const res = await axios.post(
        `https://renthub-backend-h0ot.onrender.com/api/user/${userId}/details`,
        form
      );

      console.log("NEW PROPERTY ADDED:", res.data);

      toast.success("Property added!");

      setProducts((prev) => [...prev, res.data.product]);
      setMyProducts((prev) => [...prev, res.data.product]);

      setOpen(false);
      setForm({
        name: "",
        location: "",
        price: "",
        availability: true,
        src: "",
      });
    } catch (err) {
      console.log("ADD PROPERTY ERROR:", err);
      toast.error("Failed to add property");
    }
  };


  // Fetch the whole products from the API
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      console.log("No user found in LocalStorage");
      return;
    }

    const user = JSON.parse(savedUser);
    const userId = user.id;
    axios
      .get(`https://renthub-backend-h0ot.onrender.com/api/user/${userId}/products`)
      .then((res) => {
        console.log("MY PROPERTIES:", res.data.products);
        setMyProducts(res.data.products || []);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("https://renthub-backend-h0ot.onrender.com/api/user/products")
      .then((res) => {
        console.log("API RESPONSE:", res.data);
        setProducts(res.data.products || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const navItems = [
    { id: "home" as const, label: "Home" },
    { id: "listings" as const, label: "Property Listings" },
    { id: "about" as const, label: "About Us" },
    { id: "contact" as const, label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
              RH
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                RentHub
              </h1>
              <p className="hidden sm:block text-xs text-slate-500">
                Smart rentals for students & professionals
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`relative pb-1 transition-colors ${active === item.id
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                  }`}
              >
                {item.label}
                {active === item.id && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-blue-600" />
                )}
              </button>
            ))}
            <ProfileDropdown />
          </nav>
          <div className="flex items-center gap-3 md:hidden">
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">

        {active === "home" && (
          <>
            <section className="px-4 sm:px-6 lg:px-12 py-10 lg:py-14">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)] items-center">
                <div className="space-y-6">
                  <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Verified rentals · No brokerage
                  </p>

                  <div className="space-y-3">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                      Find your next{" "}
                      <span className="text-blue-600">Rental Home</span>
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                      Explore curated and verified properties near your college or
                      office. Filter by location, budget and availability in just a few clicks.
                    </p>
                  </div>
                  <div className="items-center flex w-full max-w-xl flex-col sm:flex-row gap-3 rounded-2xl bg-white/80 border border-slate-200 shadow-sm px-3 py-3">
                    <input
                      type="text"
                      placeholder="Search by city, area, or landmark..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <Button
                      onClick={handleSearch}
                      className="whitespace-nowrap rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                    >
                      <Search size={16} />
                      Search
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      Ready to move
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      Student friendly
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      Fully furnished
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                      alt="Modern apartment"
                      className="h-52 sm:h-64 w-full object-cover"
                    />
                    <div className="space-y-3 px-5 py-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-slate-900">
                          2BHK Cozy Apartment
                        </h3>
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                          Available
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Salt Lake · Near Sector V · 2.3 km from Tech Park
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-blue-600">
                          ₹12,000 <span className="font-normal text-slate-500">/ month</span>
                        </span>
                        <span className="text-xs text-slate-500">
                          Wi-Fi · Furnished · Attached Bathroom
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">
                      Featured Properties
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Based on latest listings across the platform
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
                  {(filteredProducts.length > 0 ? filteredProducts : products).length ===
                    0 && (
                      <p className="text-sm text-slate-500 col-span-full">
                        No properties available right now.
                      </p>
                    )}
                  
                  {(filteredProducts.length > 0 ? filteredProducts : products)
                  .filter((p) => p.ownerId !== currentUser?.id)
                  .map(
                    (p) => (
                      <div
                        key={p._id}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="relative h-44 w-full overflow-hidden">
                          <img
                            src={p.src}
                            alt={p.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white">
                            {p.name}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col px-4 py-3">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {p.name}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                            {p.location}
                          </p>

                          <div className="mt-3 flex items-center justify-between text-xs">
                            <p className="text-slate-700">
                              Rent:{" "}
                              <span className="font-bold text-blue-600">
                                ₹{p.price}
                              </span>{" "}
                              <span className="text-slate-500">/ month</span>
                            </p>

                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-medium text-white ${p.availability ? "bg-green-600" : "bg-red-500"
                                }`}
                            >
                              {p.availability ? "Available" : "Not Available"}
                            </span>
                          </div>

                          {p.availability && (
                            <Button
                              onClick={() => handleBookNow(p)}
                              className="mt-3 w-full rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                              Book Now
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>

            <Footer />
          </>
        )}
        {active === "listings" && (
          <section className="px-4 sm:px-6 lg:px-12 py-10">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  My Properties
                </h1>
                <p className="text-sm text-slate-500">
                  Manage all the rooms and flats you've listed on RentHub.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setOpen(true)}
                className="rounded-xl border-blue-500 bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                Add Property
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProducts.length === 0 && (
                <p className="text-sm text-slate-500 col-span-full">
                  You haven&apos;t added any properties yet.
                </p>
              )}

              {myProducts.map((p) => (
                <div
                  key={p._id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="relative h-48 w-full">
                    <img
                      src={p.src}
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute top-3 left-3 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-medium text-white shadow">
                      {p.name}
                    </div>

                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
                      >
                        <Edit className="h-4 w-4 text-yellow-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">{p.location}</p>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-blue-600">
                        ₹{p.price}
                        <span className="text-xs font-normal text-slate-500">
                          {" "}
                          / month
                        </span>
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-medium text-white ${p.availability ? "bg-green-600" : "bg-red-500"
                          }`}
                      >
                        {p.availability ? "Available" : "Not Available"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}


        {active === "about" && (
          <section className="px-4 sm:px-6 lg:px-12 py-10">
            <About />
          </section>
        )}


        {active === "contact" && (
          <section className="px-4 sm:px-6 lg:px-12 py-10">
            <Contact />
          </section>
        )}
      </main>


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl border border-slate-200 bg-white p-0 overflow-hidden">
          <div className="px-6 py-4 bg-linear-to-r from-blue-600 to-blue-500 text-white">
            <DialogTitle className="text-lg font-semibold">
              Add Property Details
            </DialogTitle>
            <DialogDescription className="text-xs text-blue-100">
              List your rental property with clear details and photos.
            </DialogDescription>
          </div>

          <div className="px-6 py-5 bg-slate-50">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-xs font-medium text-slate-700">
                  Property Title
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="2BHK Modern Apartment"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  Location
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Kolkata, Salt Lake"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    Rent (₹)
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="12000"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">
                    Availability
                  </label>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={form.availability ? "Available" : "Not Available"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        availability: e.target.value === "Available",
                      })
                    }
                  >
                    <option>Available</option>
                    <option>Not Available</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  Image URL
                </label>
                <input
                  type="url"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="https://example.com/room.jpg"
                  value={form.src}
                  onChange={(e) => setForm({ ...form, src: e.target.value })}
                />
              </div>

              <Button
                type="button"
                onClick={handleAddProperty}
                className="mt-2 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
              >
                Save Property
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>


      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg rounded-2xl border border-slate-200 bg-white p-0 overflow-hidden">
          <div className="px-6 py-4 bg-slate-900 text-white">
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription className="text-xs text-slate-300">
              Update the property details.
            </DialogDescription>
          </div>

          <div className="space-y-4 px-6 py-5 bg-slate-50">
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={editData.location}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={editData.price}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  price: Number(e.target.value),
                })
              }
            />

            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={editData.availability ? "Available" : "Not Available"}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  availability: e.target.value === "Available",
                })
              }
            >
              <option>Available</option>
              <option>Not Available</option>
            </select>

            <input
              type="url"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={editData.src}
              onChange={(e) =>
                setEditData({ ...editData, src: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4 bg-white">
            <Button
              variant="ghost"
              onClick={() => setEditOpen(false)}
              className="text-slate-700"
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpdate}
              className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-md rounded-2xl border border-slate-200 bg-white p-0 overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white">
            <DialogTitle className="text-lg font-semibold">
              Booking Request
            </DialogTitle>
            <DialogDescription className="text-xs text-blue-100">
              Send a booking request to the property owner.
            </DialogDescription>
          </div>

          <div className="space-y-4 px-6 py-5 bg-slate-50">
            <p className="text-sm font-medium text-slate-800">
              Property:{" "}
              <span className="font-semibold text-blue-600">
                {bookingProduct?.name}
              </span>
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700">
                  Date
                </label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={bookingData.date}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  Time
                </label>
                <input
                  type="time"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={bookingData.time}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, time: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              onClick={sendBooking}
              className="mt-2 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Send Booking Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
