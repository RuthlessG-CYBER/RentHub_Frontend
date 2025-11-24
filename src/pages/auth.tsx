import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const Navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            const url = isLogin
                ? "https://renthub-backend-h0ot.onrender.com/api/user/login"
                : "https://renthub-backend-h0ot.onrender.com/api/user/signup";

            const response = await axios.post(url, form);

            if (isLogin) {
                toast.success("Welcome to RentHub!");
            } else {
                toast.success("Signup successful!");
            }

            if (isLogin) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                Navigate("/home");
            }else{
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setIsLogin(true);
            }
        } catch (error) {
            setMessage((error as Error).message);
        }
    };

    return (
        <div
            className="
        min-h-screen w-full flex items-center justify-center
        bg-linear-to-br from-[#4e7fcf] via-[#5e93e2] to-white
        relative overflow-hidden
    "
        >
            <div
                className="
            pointer-events-none absolute inset-0
            bg-[linear-gradient(to_right,rgba(59,130,246,0.08)_1px,transparent_1px),
               linear-gradient(to_bottom,rgba(59,130,246,0.08)_1px,transparent_1px)]
            bg-size-[40px_40px]
            opacity-40
        "
            ></div>
            <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border border-blue-100 shadow-xl rounded-3xl px-10 py-12">
                <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-8 tracking-tight">
                    {isLogin ? "Welcome Back" : "Create Your Account"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {!isLogin && (
                        <div>
                            <label className="text-slate-700 ml-1 text-sm font-medium">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Soumya Panda"
                                onChange={handleChange}
                                className="w-full px-4 py-3 mt-1 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-slate-700 ml-1 text-sm font-medium">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            onChange={handleChange}
                            className="w-full px-4 py-3 mt-1 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-slate-700 ml-1 text-sm font-medium">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            onChange={handleChange}
                            className="w-full px-4 py-3 mt-1 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold text-lg transition shadow-lg hover:shadow-blue-400/40"
                    >
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>
                {message && (
                    <p className="text-center text-red-500 mt-4 text-sm">{message}</p>
                )}
                
                <p className="text-center text-slate-700 mt-6 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 ml-1 font-medium hover:underline"
                    >
                        {isLogin ? "Create one" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
}
