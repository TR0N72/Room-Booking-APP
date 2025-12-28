"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import Link from "next/link";
import { Calendar, Zap, Smartphone } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        // Removed auto-redirect to prevent flashing/glitching
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkUser();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-hima-main">
      {/* ... (Background Decoratives remain same) ... */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-hima-secondary/20 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-hima-main/50 via-hima-main to-hima-main" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-6xl w-full px-4 pt-20 lg:pt-0 mb-20 lg:mb-0 lg:min-h-[80vh]">

          {/* Left Column: Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-white via-blue-100 to-blue-300 bg-clip-text text-transparent mb-6 tracking-tight leading-tight">
              Room Booking <br className="hidden lg:block" /> System
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl lg:max-w-xl leading-relaxed">
              Experience the future of space management. A premium PWA solution designed for seamless meeting room and conference hall bookings.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md lg:max-w-none justify-center lg:justify-start">
              {user ? (
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-hima-secondary text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 hover:shadow-lg hover:shadow-black/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-transparent hover:border-white/10">
                    Go to Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-hima-secondary text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 hover:shadow-lg hover:shadow-black/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-transparent hover:border-white/10">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/auth/register" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-white/5 border border-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                      Create Account
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Logo/Visual */}
          <div className="flex justify-center items-center order-1 lg:order-2">
            <div className="relative group w-64 h-64 lg:w-96 lg:h-96 flex items-center justify-center">
              <div className="absolute inset-0 bg-hima-secondary/20 blur-[80px] rounded-full group-hover:bg-hima-secondary/30 transition-all duration-500 animate-pulse" />
              <div className="relative w-48 h-48 lg:w-64 lg:h-64 bg-white/5 rounded-3xl p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 animate-float border border-white/5">
                <img
                  src="/hima-logo.png"
                  alt="HIMA RBC Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(145,216,247,0.3)]"
                />
              </div>
            </div>
          </div>
        </div>



        {/* Feature Cards - Full Width Below Hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-4 mb-20">
          {[
            { icon: Calendar, title: "Smart Browsing", desc: "Explore available meeting rooms with immersive details and real-time status." },
            { icon: Zap, title: "Instant Booking", desc: "Secure your space in seconds with our optimized booking flow." },
            { icon: Smartphone, title: "Native Experience", desc: "Install as a PWA for offline access and native-like performance on any device." }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group text-left">
              <div className="text-4xl mb-4 bg-hima-main/50 w-16 h-16 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 text-hima-link">
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-hima-secondary transition-colors">{feature.title}</h3>
              <p className="text-slate-300 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} HIMA RBC. All rights reserved.
      </div>
    </div>
  );
}
