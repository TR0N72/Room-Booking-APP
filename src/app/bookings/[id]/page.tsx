"use client";

import { CalendarDays, Clock, MapPin, Users } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { bookingService } from "@/services/bookings";
import { roomService } from "@/services/rooms";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Booking, Room } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const bookingData = await bookingService.getBookingById(bookingId);
        if (bookingData) {
          setBooking(bookingData);
          const roomData = await roomService.getRoomById(bookingData.room_id);
          setRoom(roomData);
        }
      } catch (error) {
        console.error("Error loading booking:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookingId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/20";
      case "rejected":
        return "bg-red-500/20 text-red-300 border border-red-500/20";
      case "completed":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/20";
      default:
        return "bg-slate-500/20 text-slate-300 border border-slate-500/20";
    }
  };

  if (loading)
    return (
      <MainLayout>
        <div className="p-4">Loading...</div>
      </MainLayout>
    );
  if (!booking)
    return (
      <MainLayout>
        <div className="p-4">Booking not found</div>
      </MainLayout>
    );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button onClick={() => router.back()} className="mb-8 text-hima-link hover:text-white font-medium flex items-center gap-2 transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
          </button>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 pb-8 border-b border-white/10">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">{room?.name || "Room"}</h1>
                <p className="text-slate-300 text-lg">{room?.description}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-wider ${getStatusColor(booking.status)}`}>{booking.status}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Date</p>
                <p className="text-xl font-bold text-white flex items-center gap-3">
                  <CalendarDays className="w-6 h-6 text-slate-400" /> {formatDate(booking.start_date)}
                </p>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Time</p>
                <p className="text-xl font-bold text-white flex items-center gap-3">
                  <Clock className="w-6 h-6 text-slate-400" /> {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                </p>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Location</p>
                <p className="text-xl font-bold text-white flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-slate-400" /> {room?.location}
                </p>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Capacity</p>
                <p className="text-xl font-bold text-white flex items-center gap-3">
                  <Users className="w-6 h-6 text-slate-400" /> {room?.capacity} <span className="text-sm font-normal text-slate-400">persons</span>
                </p>
              </div>
            </div>

            {booking.token && (
              <div className="bg-hima-secondary/10 rounded-2xl p-6 mb-8 border border-hima-secondary/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-hima-secondary/5 group-hover:bg-hima-secondary/10 transition-colors duration-500" />
                <div className="relative z-10">
                  <p className="text-hima-link text-xs font-bold uppercase tracking-widest mb-2">Booking Token</p>
                  <p className="text-2xl font-mono font-bold text-white break-all tracking-wider">{booking.token}</p>
                  {booking.token_expires_at && <p className="text-xs text-slate-400 mt-2 font-mono">Expires: {formatDate(booking.token_expires_at)}</p>}
                </div>
              </div>
            )}

            {booking.notes && (
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Notes</p>
                <p className="text-slate-200 italic leading-relaxed border-l-2 border-white/20 pl-4">{booking.notes}</p>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
