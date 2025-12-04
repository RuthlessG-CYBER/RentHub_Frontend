import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { CardDescription } from "@/components/ui/card";

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
            } else {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setIsLogin(true);
            }
        } catch (error) {
            setMessage((error as Error).message);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#dce9ff] via-white to-[#e3efff] relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-300/30 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] bg-blue-500/30 blur-3xl rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="backdrop-blur-xl bg-white/70 border border-blue-100 shadow-2xl rounded-3xl p-6">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-3xl font-semibold text-blue-900 tracking-tight">
                            {isLogin ? "Welcome Back" : "Create an Account"}
                        </CardTitle>
                        <CardDescription className="text-blue-600">
                            {isLogin ? "Sign in to continue" : "Sign up to get started"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <div className="space-y-1">
                                    <Label className="text-blue-800">Full Name</Label>
                                    <Input
                                        name="name"
                                        placeholder="Enter your name"
                                        onChange={handleChange}
                                        required
                                        className="bg-white text-blue-900 placeholder-blue-400 border-blue-200 focus-visible:ring-blue-500"
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <Label className="text-blue-800">Email</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    onChange={handleChange}
                                    required
                                    className="bg-white text-blue-900 placeholder-blue-400 border-blue-200 focus-visible:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-blue-800">Password</Label>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    onChange={handleChange}
                                    required
                                    className="bg-white text-blue-900 placeholder-blue-400 border-blue-200 focus-visible:ring-blue-500"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-6 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                            >
                                {isLogin ? "Login" : "Sign Up"}
                            </Button>
                        </form>

                        {message && (
                            <p className="text-center text-red-500 mt-4 text-sm">{message}</p>
                        )}

                        <p className="text-center text-blue-700 mt-6 text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-1 font-medium text-blue-800 hover:underline"
                            >
                                {isLogin ? "Create one" : "Login"}
                            </button>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
