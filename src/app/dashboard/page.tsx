"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { bookingService } from "@/services/bookings";
import { roomService } from "@/services/rooms";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BookingCard } from "@/components/BookingCard";
import { Booking, Room } from "@/types";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const userBookings = await bookingService.getBookingsByUserId(currentUser.id);
          setBookings(userBookings);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const approvedBookings = bookings.filter((b) => b.status === "approved");

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Welcome, {user?.email}!</h1>
            <p className="text-sm sm:text-base text-slate-300">Manage your room bookings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow p-6">
              <p className="text-slate-300 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold text-white">{bookings.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow p-6">
              <p className="text-slate-300 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-400">{pendingBookings.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow p-6">
              <p className="text-slate-300 text-sm">Approved</p>
              <p className="text-3xl font-bold text-green-400">{approvedBookings.length}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Recent Bookings</h2>
              <Link href="/rooms">
                <button className="bg-hima-secondary text-white px-4 py-2 rounded-lg hover:bg-hima-secondary/80">New Booking</button>
              </Link>
            </div>

            {loading ? (
              <p className="text-slate-400">Loading...</p>
            ) : bookings.length === 0 ? (
              <p className="text-slate-400">No bookings yet. Start by booking a room!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.slice(0, 6).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} room={booking.rooms!} />
                ))}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
