"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { toast } from "sonner";
import { LayoutDashboard, DoorOpen, CalendarDays, Settings, User, LogOut } from "lucide-react";

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const NavItem = ({ href, icon: Icon, label, isActive, onClick }: any) => {
    const content = (
      <>
        {isActive && (
          <div className="absolute top-0 w-12 h-1 bg-hima-secondary rounded-b-full shadow-[0_4px_12px_rgba(59,130,246,0.5)]" />
        )}
        <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? "bg-blue-500/10 scale-110" : "bg-transparent group-hover:bg-slate-100"}`}>
          <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="transition-transform duration-300" />
        </div>

        {/* Label - Only visible when active */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? "max-w-[100px] opacity-100 mt-1" : "max-w-0 opacity-0 mt-0"}`}>
          <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">
            {label}
          </span>
        </div>
      </>
    );

    const className = `flex-1 flex flex-col items-center justify-center py-3 px-1 transition-all duration-300 relative group leading-none ${isActive ? "text-hima-secondary grow-[1.5]" : "text-slate-400 hover:text-slate-600 grow"
      }`;

    if (href) {
      return (
        <Link href={href} className={className}>
          {content}
        </Link>
      );
    }

    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    );
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-white/20 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex justify-around items-center w-full max-w-lg mx-auto">
        <NavItem
          href="/dashboard"
          icon={LayoutDashboard}
          label="Home"
          isActive={pathname === "/dashboard"}
        />
        <NavItem
          href="/rooms"
          icon={DoorOpen}
          label="Rooms"
          isActive={pathname.startsWith("/rooms")}
        />
        <NavItem
          href="/bookings"
          icon={CalendarDays}
          label="Bookings"
          isActive={pathname.startsWith("/bookings")}
        />
        {isAdmin && (
          <NavItem
            href="/admin"
            icon={Settings}
            label="Admin"
            isActive={pathname.startsWith("/admin")}
          />
        )}
        <NavItem
          href="/profile"
          icon={User}
          label="Profile"
          isActive={pathname === "/profile"}
        />
      </div>
    </nav>
  );
}
