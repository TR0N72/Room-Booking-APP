"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { toast } from "sonner";

export function TopNavigation() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                const profile = await authService.getUserProfile(currentUser.id);
                setIsAdmin(profile?.role === "admin");
            }
        };

        checkUser();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            toast.success("Logged out successfully");
            router.push("/auth/login");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    if (!user) return null;

    const linkBaseClasses = "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10";
    const activeLinkClasses = "text-hima-link bg-white/5 shadow-inner shadow-white/5";
    const inactiveLinkClasses = "text-slate-300 hover:text-white";

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 ${isScrolled
                    ? "bg-hima-secondary/90 backdrop-blur-xl shadow-lg shadow-black/10 py-2"
                    : "bg-hima-secondary/60 backdrop-blur-sm py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">

                    {/* Logo / Brand (Visible on larger screens or as icon on mobile) */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <div className="relative w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full p-1.5 shadow-lg ring-1 ring-white/10 backdrop-blur-md flex items-center justify-center">
                            <img
                                src="/himaskom-logo.png"
                                alt="HIMASKOM"
                                className="w-full h-full object-contain drop-shadow-md"
                            />
                        </div>
                        <span className="hidden md:block font-bold text-lg text-white tracking-tight">
                            HIMA<span className="text-hima-link">RBC</span>
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar mask-gradient px-2 md:px-0">
                        <Link href="/dashboard" className={`${linkBaseClasses} ${pathname === "/dashboard" ? activeLinkClasses : inactiveLinkClasses}`}>
                            Dashboard
                        </Link>
                        <Link href="/rooms" className={`${linkBaseClasses} ${pathname.startsWith("/rooms") ? activeLinkClasses : inactiveLinkClasses}`}>
                            Rooms
                        </Link>
                        <Link href="/bookings" className={`${linkBaseClasses} ${pathname.startsWith("/bookings") ? activeLinkClasses : inactiveLinkClasses}`}>
                            Bookings
                        </Link>
                        {isAdmin && (
                            <Link href="/admin" className={`${linkBaseClasses} ${pathname.startsWith("/admin") ? activeLinkClasses : inactiveLinkClasses}`}>
                                Admin
                            </Link>
                        )}
                        <Link href="/profile" className={`${linkBaseClasses} ${pathname === "/profile" ? activeLinkClasses : inactiveLinkClasses}`}>
                            Profile
                        </Link>
                    </div>

                    {/* User Actions */}
                    <div className="flex-shrink-0 ml-4 hidden md:block">
                        <button
                            onClick={handleLogout}
                            className="text-xs font-medium bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 px-4 py-2 rounded-lg transition-all"
                        >
                            Sign Out
                        </button>
                    </div>

                    {/* Mobile Logout (Icon only) */}
                    <div className="md:hidden ml-2">
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
}
