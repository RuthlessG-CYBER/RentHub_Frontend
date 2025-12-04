import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
        <div className="min-h-screen w-full flex items-center justify-center bg-blue-50">
            <Card className="w-full max-w-md shadow-lg border border-blue-100 rounded-2xl">
                <CardHeader className="text-center space-y-2 pt-8">
                    <CardTitle className="text-3xl font-bold text-blue-900">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </CardTitle>
                    <CardDescription className="text-blue-600 text-sm">
                        {isLogin ? "Sign in to continue" : "Join us to get started"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {!isLogin && (
                            <div className="space-y-1">
                                <Label className="text-sm text-blue-900">Full Name</Label>
                                <Input
                                    name="name"
                                    placeholder="Enter your name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <Label className="text-sm text-blue-900">Email</Label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-sm text-blue-900">Password</Label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Enter password"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full h-11 text-base font-semibold bg-blue-800 hover:bg-blue-900">
                            {isLogin ? "Login" : "Sign Up"}
                        </Button>
                    </form>

                    {message && (
                        <p className="text-center text-red-500 mt-4 text-sm">{message}</p>
                    )}

                    <p className="text-center text-blue-800 mt-6 text-sm">
                        {isLogin ? "Don’t have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-1 font-semibold text-blue-900 hover:underline"
                        >
                            {isLogin ? "Create one" : "Login"}
                        </button>
                    </p>
                </CardContent>
            </Card>
        </div>



    );
}
