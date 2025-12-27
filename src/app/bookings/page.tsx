"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { bookingService } from "@/services/bookings";
import { roomService } from "@/services/rooms";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BookingCard } from "@/components/BookingCard";
import { Booking, Room } from "@/types";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Map<string, Room>>(new Map());
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const userBookings = await bookingService.getBookingsByUserId(currentUser.id);
          setBookings(userBookings);

          const roomMap = new Map<string, Room>();
          for (const booking of userBookings) {
            const room = await roomService.getRoomById(booking.room_id);
            if (room) {
              roomMap.set(booking.room_id, room);
            }
          }
          setRooms(roomMap);
        }
      } catch (error) {
        console.error("Error loading bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredBookings = filterStatus === "all" ? bookings : bookings.filter((b) => b.status === filterStatus);

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">My Bookings</h1>

          <div className="mb-6">
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "approved", "completed", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === status ? "bg-hima-secondary text-white" : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10"}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading bookings...</p>
          ) : filteredBookings.length === 0 ? (
            <p className="text-gray-600">No bookings found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} room={rooms.get(booking.room_id)} />
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
