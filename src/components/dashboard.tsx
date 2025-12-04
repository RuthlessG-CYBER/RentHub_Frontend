import React, { useEffect, useState } from "react";
import {
  Home,
  Bell,
  User,
  HomeIcon,
  LayoutGrid,
  LayoutPanelLeft,
  Clock,
  IndianRupee,
  Calendar1,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { useNavigate } from "react-router-dom";
import axios from "axios";


const API_BASE = "https://renthub-backend-h0ot.onrender.com/api/user";


/* Types */
export type ProductType = {
  _id: string;
  name: string;
  src: string;
  price: number;
  location: string;
  availability: boolean;
  ownerId: string;
};

export type BookingType = {
  _id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  status: "pending" | "accepted" | "rejected";
  paymentStatus?: "pending" | "success" | "failed";
};

export type NotificationType = {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  isRead: boolean;
  createdAt: string;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
};

/* Dashboard */
export default function Dashboard() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  const [user] = useState<UserType | null>(() => {
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser) as UserType;
    } catch {
      return null;
    }
  });

  const [activeSection, setActiveSection] = useState<
    "home" | "tenant" | "landlord" | "applications" | "notifications"
  >("home");

  const [products, setProducts] = useState<ProductType[]>([]);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const myProducts = await axios.get(
          `${API_BASE}/${user.id}/products`
        );
        setProducts(myProducts.data.products || []);

        const all = await axios.get(`${API_BASE}/products`);
        setAllProducts(all.data.products || []);

        const myBookings = await axios.get(
          `${API_BASE}/bookings/${user.id}`
        );
        setBookings(myBookings.data.bookings || []);

        const notif = await axios.get(
          `${API_BASE}/${user.id}/notifications`
        );
        setNotifications(notif.data.notifications || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-sky-50 via-white to-blue-50">
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/60 shadow-[0_10px_40px_rgba(15,23,42,0.12)] flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-linear-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-md">
            RH
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              RentHub
            </h1>
            <p className="text-[11px] text-slate-500">
              Tenant & Landlord Control Center
            </p>
          </div>
        </div>

        <nav className="flex flex-col p-4 gap-1 text-gray-800">
          <SidebarItem
            icon={<Home size={18} />}
            label="Overview"
            active={activeSection === "home"}
            onClick={() => setActiveSection("home")}
          />
          <SidebarItem
            icon={<LayoutGrid size={18} />}
            label="Tenant Dashboard"
            active={activeSection === "tenant"}
            onClick={() => setActiveSection("tenant")}
          />
          <SidebarItem
            icon={<LayoutPanelLeft size={18} />}
            label="Landlord Dashboard"
            active={activeSection === "landlord"}
            onClick={() => setActiveSection("landlord")}
          />
          <SidebarItem
            icon={<User size={18} />}
            label="My Applications"
            active={activeSection === "applications"}
            onClick={() => setActiveSection("applications")}
          />
          <SidebarItem
            icon={<Bell size={18} />}
            label="Notifications"
            active={activeSection === "notifications"}
            onClick={() => setActiveSection("notifications")}
          />
        </nav>

        <div className="mt-auto p-4 border-t border-slate-100 text-xs text-slate-500">
          <p className="font-medium text-slate-600">Logged in as</p>
          <p className="truncate">{user?.email}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-lg px-8 py-4 shadow-sm flex items-center justify-between border-b border-slate-100">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-500 font-semibold">
              Dashboard
            </p>
            <h2 className="text-xl font-semibold capitalize text-slate-900 flex items-center gap-2">
              {activeSection === "home" && "Overview"}
              {activeSection === "tenant" && "Tenant Dashboard"}
              {activeSection === "landlord" && "Landlord Dashboard"}
              {activeSection === "applications" && "My Applications"}
              {activeSection === "notifications" && "Notifications"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="border-slate-200 hover:bg-sky-50"
              onClick={() => navigate("/home")}
            >
              <HomeIcon size={18} className="text-slate-600" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-slate-200 hover:bg-sky-50 relative"
            >
              <Bell size={18} className="text-slate-600" />
              {notifications.some((n) => !n.isRead) && (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-sky-500 ring-2 ring-white" />
              )}
            </Button>

            {user && (
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-slate-500">Account Owner</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center font-semibold shadow-md ring-2 ring-white">
                  {getInitials(user.name)}
                </div>
              </div>
            )}
          </div>
        </header>

        <section className="p-8">
          {activeSection === "home" && <HomeSection bookings={bookings} />}
          {activeSection === "tenant" && (
            <TenantDashboard allProducts={allProducts} />
          )}
          {activeSection === "landlord" && user && (
            <LandlordDashboard
              owner={user}
              products={products}
              bookings={bookings}
            />
          )}
          {activeSection === "applications" && (
            <ApplicationsSection bookings={bookings} user={user} />
          )}
          {activeSection === "notifications" && user && (
            <NotificationsSection
              notifications={notifications}
              userId={user.id}
            />
          )}
        </section>
      </main>
    </div>
  );
}

/* Home Section */
function HomeSection({ bookings }: { bookings: BookingType[] }) {
  const pending = bookings.filter((b) => b.status === "pending").length;
  const accepted = bookings.filter((b) => b.status === "accepted").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={bookings.length}
          badge="All Time"
        />
        <StatCard
          title="Pending Requests"
          value={pending}
          badge="Waiting"
          tone="warning"
        />
        <StatCard
          title="Accepted"
          value={accepted}
          badge="Approved"
          tone="success"
        />
        <StatCard
          title="Next Payment"
          value={"₹0"}
          badge="Coming Soon"
          tone="info"
        />
      </div>

      <Card className="border border-sky-100 bg-linear-to-r from-sky-50/80 via-white to-blue-50/80 shadow-[0_22px_60px_rgba(15,23,42,0.10)]">
        <CardHeader>
          <CardTitle className="text-slate-900">Activity Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Track your bookings, responses and notifications here. Use the{" "}
          <span className="font-semibold text-sky-600">
            Tenant Dashboard
          </span>{" "}
          to explore rooms and the{" "}
          <span className="font-semibold text-sky-600">
            Landlord Dashboard
          </span>{" "}
          to manage your properties and booking requests.
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  badge,
  tone = "default",
}: {
  title: string;
  value: number | string;
  badge?: string;
  tone?: "default" | "success" | "warning" | "info";
}) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : tone === "info"
          ? "bg-sky-50 text-sky-700 border-sky-100"
          : "bg-slate-50 text-slate-700 border-slate-100";

  return (
    <Card className="shadow-[0_18px_45px_rgba(15,23,42,0.08)] hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)] hover:-translate-y-0.5 transition-all duration-200 bg-white/90 border border-slate-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {title}
        </CardTitle>
        {badge && (
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border ${toneClasses}`}
          >
            {badge}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-slate-900">{value}</div>
      </CardContent>
    </Card>
  );
}

/* Tenant Dashboard */
function TenantDashboard({ allProducts }: { allProducts: ProductType[] }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Available Rooms
          </h1>
          <p className="text-sm text-slate-500">
            Browse all listed properties from different owners.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {allProducts.map((p) => (
          <Card
            key={p._id}
            className="shadow-[0_12px_35px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.16)] hover:-translate-y-1 transition-all duration-200 bg-white/90 border border-slate-100 overflow-hidden"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src={p.src}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-100 uppercase tracking-wide">
                    {p.location}
                  </p>
                  <p className="text-white font-semibold text-sm truncate">
                    {p.name}
                  </p>
                </div>
                <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-sky-700 shadow">
                  ₹{p.price}/m
                </div>
              </div>
            </div>
            <CardContent className="pt-4 pb-4 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.availability
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}
                >
                  {p.availability ? "Available" : "Not Available"}
                </span>
                <span className="text-xs text-slate-400">
                  Owner ID: {p.ownerId.slice(0, 6)}...
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* Landlord Dashboard */
function LandlordDashboard({
  owner,
  products,
  bookings,
}: {
  owner: UserType;
  products: ProductType[];
  bookings: BookingType[];
}) {
  const ownerRequests = bookings.filter((b) => b.to === owner.id);

  const accept = async (bookingId: string) => {
    await axios.post(
      `${API_BASE}/bookings/${owner.id}/${bookingId}/accept`
    );
    window.location.reload();
  };

  const reject = async (bookingId: string) => {
    await axios.post(
      `${API_BASE}/bookings/${owner.id}/${bookingId}/reject`
    );
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Landlord Control Panel
        </h1>
        <p className="text-sm text-slate-500">
          Manage incoming booking requests and your listed properties.
        </p>
      </div>

      <Card className="bg-white/90 border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <CardHeader>
          <CardTitle className="text-slate-900 text-base">
            Booking Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ownerRequests.length === 0 ? (
            <p className="text-sm text-slate-500">No requests yet.</p>
          ) : (
            <div className="space-y-3">
              {ownerRequests.map((b) => (
                <div
                  key={b._id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3"
                >
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-800">
                      <span className="font-medium">Date:</span> {b.date}{" "}
                      <span className="mx-2 text-slate-400">•</span>
                      <span className="font-medium">Time:</span> {b.time}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-medium">Price:</span> ₹{b.price}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">
                        Status:
                      </span>{" "}
                      <span
                        className={
                          b.status === "pending"
                            ? "text-amber-600"
                            : b.status === "accepted"
                              ? "text-emerald-600"
                              : "text-rose-600"
                        }
                      >
                        {b.status}
                      </span>
                    </p>
                  </div>

                  {b.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                        onClick={() => accept(b._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        className="bg-rose-600 hover:bg-rose-700 text-white text-sm"
                        onClick={() => reject(b._id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          My Properties
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card
              key={p._id}
              className="shadow-[0_12px_35px_rgba(15,23,42,0.08)] bg-white/90 border border-slate-100 overflow-hidden"
            >
              <div className="h-36 w-full overflow-hidden">
                <img
                  src={p.src}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="pt-4 pb-4 text-sm">
                <p className="font-semibold text-slate-900">{p.name}</p>
                <p className="text-slate-500 text-xs mt-1">{p.location}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sky-700 font-semibold">
                    ₹{p.price}/month
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${p.availability
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}
                  >
                    {p.availability ? "Available" : "Not Available"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Applications Section */
function ApplicationsSection({
  bookings,
  user,
}: {
  bookings: BookingType[];
  user: UserType | null;
}) {

  interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
  const handlePayNow = async (booking: BookingType) => {
    try {
      const orderRes = await axios.post(`${API_BASE}/payments/create-order`, {
        bookingId: booking._id,
      });

      const { key, amount, currency, orderId } = orderRes.data;

      const options = {
        key,
        amount,
        currency,
        name: "RentHub",
        description: "Room booking payment",
        order_id: orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#0ea5e9",
        },
        handler: async (response: RazorpayResponse) => {
          try {
            await axios.post(`${API_BASE}/payments/verify`, {
              bookingId: booking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            window.location.reload();
          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Unable to start payment");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          My Applications
        </h1>
        <p className="text-sm text-slate-500">
          All booking requests you have sent to different landlords.
        </p>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-slate-500">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card
              key={b._id}
              className="p-5 rounded-2xl border border-slate-200 shadow-md bg-white hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-800">
                  Booking Details
                </h3>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${b.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : b.status === "accepted"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                >
                  {b.status}
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">
                    <Calendar1 size={16} />
                  </span>
                  <span className="font-medium">Date:</span>
                  <span className="ml-auto">{b.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">
                    <Clock size={16} />
                  </span>
                  <span className="font-medium">Time:</span>
                  <span className="ml-auto">{b.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">
                    <IndianRupee size={16} />
                  </span>
                  <span className="font-medium">Price:</span>
                  <span className="ml-auto font-semibold text-blue-700">
                    ₹{b.price}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Payment:{" "}
                  {b.paymentStatus === "success"
                    ? "Paid"
                    : b.paymentStatus === "failed"
                      ? "Failed"
                      : "Pending"}
                </span>

                {b.status === "accepted" && b.paymentStatus !== "success" && (
                  <Button
                    className="bg-sky-600 hover:bg-sky-700 text-white text-xs"
                    onClick={() => handlePayNow(b)}
                  >
                    Pay Now
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* Notifications Section */
function NotificationsSection({
  notifications,
  userId,
}: {
  notifications: NotificationType[];
  userId: string;
}) {
  const markRead = async (id: string) => {
    await axios.put(
      `${API_BASE}/${userId}/notifications/${id}/read`
    );
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Notifications
        </h1>
        <p className="text-sm text-slate-500">
          Booking decisions and important updates appear here.
        </p>
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-slate-500">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n._id}
              className={`p-4 border shadow-sm bg-white/90 ${n.isRead ? "opacity-70" : "border-sky-400"
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{n.title}</h3>
                  <p className="text-sm text-slate-700 mt-1">{n.message}</p>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>

                {!n.isRead && (
                  <Button
                    className="bg-sky-600 hover:bg-sky-700 text-white text-xs"
                    onClick={() => markRead(n._id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* Sidebar Item */
function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${active
          ? "bg-linear-to-r from-sky-500 to-blue-600 text-white shadow-md"
          : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
        }`}
    >
      <span
        className={`h-8 w-8 rounded-lg flex items-center justify-center ${active
            ? "bg-white/10 text-white"
            : "bg-slate-100 text-slate-500"
          }`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
