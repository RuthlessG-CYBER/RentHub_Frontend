import { Mail, MapPin, Phone, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export const Contact = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">

        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-14 tracking-tight">
          Get in <span className="text-blue-600">Touch</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          <div className="group bg-white border rounded-2xl p-8 shadow-sm hover:shadow-xl 
                          hover:border-blue-500 transition-all duration-300 text-center">
            <div className="h-14 w-14 mx-auto flex items-center justify-center rounded-xl 
                            bg-blue-50 text-blue-600 group-hover:bg-blue-600 
                            group-hover:text-white transition">
              <Phone size={26} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mt-4">Call Us</h3>
            <p className="text-slate-500 text-sm mt-1">+91 98765 43210</p>
          </div>
          <div className="group bg-white border rounded-2xl p-8 shadow-sm hover:shadow-xl 
                          hover:border-purple-500 transition-all duration-300 text-center">
            <div className="h-14 w-14 mx-auto flex items-center justify-center rounded-xl 
                            bg-purple-50 text-purple-600 group-hover:bg-purple-600 
                            group-hover:text-white transition">
              <Mail size={26} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mt-4">Email</h3>
            <p className="text-slate-500 text-sm mt-1">support@renthub.com</p>
          </div>
          <div className="group bg-white border rounded-2xl p-8 shadow-sm hover:shadow-xl 
                          hover:border-green-500 transition-all duration-300 text-center">
            <div className="h-14 w-14 mx-auto flex items-center justify-center rounded-xl 
                            bg-green-50 text-green-600 group-hover:bg-green-600 
                            group-hover:text-white transition">
              <MapPin size={26} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mt-4">Location</h3>
            <p className="text-slate-500 text-sm mt-1">Kolkata, West Bengal, India</p>
          </div>

        </div>
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-5">Follow Us</h3>

          <div className="flex justify-center gap-8 text-xl text-slate-600">
            <div className="hover:text-blue-600 transition cursor-pointer"><Instagram /></div>
            <div className="hover:text-blue-600 transition cursor-pointer"><Twitter /></div>
            <div className="hover:text-blue-600 transition cursor-pointer"><Facebook /></div>
            <div className="hover:text-blue-600 transition cursor-pointer"><Linkedin /></div>
          </div>
        </div>

      </div>
    </section>
  );
};
