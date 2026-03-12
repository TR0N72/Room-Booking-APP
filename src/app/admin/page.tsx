"use client";

import { BarChart3, DoorOpen, CalendarCheck, Clock, LayoutGrid } from "lucide-react";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { roomService } from "@/services/rooms";
import { bookingService } from "@/services/bookings";
import { User } from "@/types";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const profileData = await authService.getUserProfile(currentUser.id);

          // Check if user is admin
          if (profileData?.role !== "admin") {
            router.push("/dashboard");
            return;
          }

          setProfile(profileData);

          // Load statistics
          const allRooms = await roomService.getAllRooms();
          const allBookings = await bookingService.getAllBookings();
          const pendingBookings = allBookings.filter((b) => b.status === "pending");

          setStats({
            totalRooms: allRooms.length,
            totalBookings: allBookings.length,
            pendingBookings: pendingBookings.length,
          });
        }
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading)
    return (
      <MainLayout>
        <div className="p-4">Loading...</div>
      </MainLayout>
    );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl text-white mb-8">Admin Panel</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow p-6 flex flex-col justify-between">
              <div>
                <LayoutGrid className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-slate-300 text-sm">Total Rooms</p>
              </div>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalRooms}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow p-6 flex flex-col justify-between">
              <div>
                <CalendarCheck className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-slate-300 text-sm">Total Bookings</p>
              </div>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalBookings}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow p-6 flex flex-col justify-between">
              <div>
                <Clock className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-slate-300 text-sm">Pending Approvals</p>
              </div>
              <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.pendingBookings}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/rooms">
              <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-blue-500/20 hover:scale-[1.02] transition-all border border-blue-500/20 group h-full">
                <DoorOpen className="w-8 h-8 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors" />
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">Manage Rooms</h2>
                <p className="text-slate-300 mb-4">Add, edit, or delete meeting rooms</p>
                <div className="text-hima-link font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">Go to Rooms <span>→</span></div>
              </div>
            </Link>

            <Link href="/admin/bookings">
              <div className="bg-green-500/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-green-500/20 hover:scale-[1.02] transition-all border border-green-500/20 group h-full">
                <CalendarCheck className="w-8 h-8 text-green-400 mb-4 group-hover:text-green-300 transition-colors" />
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">Manage Bookings</h2>
                <p className="text-slate-300 mb-4">Approve or reject booking requests</p>
                <div className="text-green-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">Go to Bookings <span>→</span></div>
              </div>
            </Link>

            <Link href="/admin/analytics">
              <div className="bg-purple-500/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-purple-500/20 hover:scale-[1.02] transition-all border border-purple-500/20 md:col-span-2 group h-full">
                <BarChart3 className="w-8 h-8 text-purple-400 mb-4 group-hover:text-purple-300 transition-colors" />
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">Analytics Dashboard</h2>
                <p className="text-slate-300 mb-4">View insights and facility usage trends</p>
                <div className="text-purple-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">View Reports <span>→</span></div>
              </div>
            </Link>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
