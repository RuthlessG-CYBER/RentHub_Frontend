import AuthPage from "./pages/auth";
import HomePage from "./pages/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/dashboard";


export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          toastStyle={{
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            color: "#ffffff",
            borderRadius: "12px",
            padding: "16px 18px",
            fontSize: "15px",
            fontWeight: "500",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            backdropFilter: "blur(6px)",
          }}
        />


      </BrowserRouter>

    </>
  )
}
