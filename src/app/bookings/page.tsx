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
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8 tracking-tight drop-shadow-md">My Bookings</h1>

            <div className="flex gap-2 flex-wrap bg-white/5 p-2 rounded-2xl border border-white/10 w-fit backdrop-blur-sm">
              {["all", "pending", "approved", "completed", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${filterStatus === status
                      ? "bg-hima-secondary text-white shadow-lg shadow-hima-secondary/25"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-slate-400 animate-pulse text-lg">Loading bookings...</p>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/5">
              <p className="text-slate-300 text-lg">No bookings found {filterStatus !== 'all' && `in ${filterStatus} status`}.</p>
            </div>
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
