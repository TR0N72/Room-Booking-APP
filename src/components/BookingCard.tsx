"use client";

import { Booking, Room } from "@/types";
import Link from "next/link";
import { formatDate, formatTime } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
  room?: Room;
}

export function BookingCard({ booking, room }: BookingCardProps) {
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

  return (
    <Link href={`/bookings/${booking.id}`}>
      <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 cursor-pointer hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hima-secondary/0 via-hima-secondary/0 to-hima-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-heading font-bold text-white group-hover:text-hima-link transition-colors">{room?.name || "Room"}</h3>
            <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${getStatusColor(booking.status)}`}>{booking.status}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-300 group-hover:text-white transition-colors">
              <span className="w-6 opacity-60">📅</span>
              {formatDate(booking.start_date)}
            </div>
            <div className="flex items-center text-sm text-slate-300 group-hover:text-white transition-colors">
              <span className="w-6 opacity-60">⏰</span>
              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
            </div>
          </div>

          {booking.token && (
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-500">Token ID</span>
              <p className="text-xs text-hima-link font-mono bg-hima-link/10 px-2 py-1 rounded border border-hima-link/20">{booking.token.substring(0, 8)}...</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
