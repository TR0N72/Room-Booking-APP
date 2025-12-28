"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { roomService } from "@/services/rooms";
import { bookingService } from "@/services/bookings";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Room } from "@/types";
import { Booking } from "@/types";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { RoomCalendar } from "@/components/RoomCalendar";

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        const [roomData, bookingsData] = await Promise.all([
          roomService.getRoomById(roomId),
          bookingService.getBookingsByRoomId(roomId)
        ]);

        setRoom(roomData);
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error loading room:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [roomId]);

  const handleBookNow = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    router.push(`/bookings/create?roomId=${roomId}`);
  };

  if (loading)
    return (
      <MainLayout>
        <div className="p-4">Loading...</div>
      </MainLayout>
    );
  if (!room)
    return (
      <MainLayout>
        <div className="p-4">Room not found</div>
      </MainLayout>
    );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button onClick={() => router.back()} className="mb-8 text-hima-link hover:text-white font-medium flex items-center gap-2 transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
          </button>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl mb-8">
            {room.image_url && (
              <div className="w-full h-80 bg-slate-800 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-hima-main via-transparent to-transparent opacity-60" />
                <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 tracking-tight">{room.name}</h1>
                  <p className="text-slate-300 text-lg leading-relaxed">{room.description}</p>
                </div>

                <div className="w-full md:w-auto flex-shrink-0">
                  <button onClick={handleBookNow} className="w-full md:w-auto px-10 py-4 bg-hima-secondary text-white rounded-xl font-bold hover:bg-white/10 hover:shadow-lg hover:shadow-hima-secondary/20 transition-all transform hover:-translate-y-0.5 border border-transparent hover:border-white/10">
                    Book This Room
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 border-y border-white/10 py-8">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition-colors">
                  <p className="text-hima-link text-xs uppercase tracking-widest font-bold mb-2">Capacity</p>
                  <p className="text-3xl font-bold text-white">{room.capacity} <span className="text-lg text-slate-400 font-normal">persons</span></p>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition-colors">
                  <p className="text-hima-link text-xs uppercase tracking-widest font-bold mb-2">Status</p>
                  <p className="text-3xl font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    Available
                  </p>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition-colors">
                  <p className="text-hima-link text-xs uppercase tracking-widest font-bold mb-2">Location</p>
                  <p className="text-xl font-bold text-white mt-1">{room.location}</p>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-2xl font-heading font-bold text-white mb-6">Room Availability</h3>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <RoomCalendar bookings={bookings} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
