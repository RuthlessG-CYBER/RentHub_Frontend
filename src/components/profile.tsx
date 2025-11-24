import { useState } from "react";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";


type UserType = {
  name: string;
  email: string;
};

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");

  const [user] = useState<UserType | null>(() => {
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow hover:shadow-lg transition border"
      >
        <span className="font-medium">
          {user?.name?.split(" ")[0] || "User"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-52 bg-white shadow-lg rounded-xl border p-3 z-50">
          <div className="px-2 py-2 border-b">
            <h3 className="font-semibold">{user?.name || "User"}</h3>
            <p className="text-sm text-gray-600">{user?.email || "No email"}</p>
          </div>

          <div className="mt-2"></div>

          {/* <button className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 rounded-lg text-sm">
            <User size={18} /> View Profile
          </button> */}

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 rounded-lg text-sm"
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>


          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 w-full hover:bg-red-100 text-red-600 rounded-lg text-sm mt-1"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
