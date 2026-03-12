"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/common/MainLayout";
import { authService } from "@/services/auth";
import { roomService } from "@/services/rooms";
import { bookingService } from "@/services/bookings";
import { toast } from "sonner";

import { Room, User } from "@/types";

function CreateBookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomId = searchParams.get("roomId");
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "10:00",
    notes: "",
  });

  useEffect(() => {
    if (!roomId) {
      toast.error("Room not found");
      router.push("/rooms");
      return;
    }

    // Get current user
    authService.getCurrentUser().then((user) => {
      setUser(user);
    });

    fetchRoom();
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const data = await roomService.getRoomById(roomId!);
      if (!data) throw new Error("Room not found");
      setRoom(data);
    } catch (error) {
      console.error("Error fetching room:", error);
      toast.error("Failed to load room details");
      router.push("/rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      router.push("/auth/login");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setSubmitting(true);
    try {
      await bookingService.createBooking({
        user_id: user.id,
        room_id: roomId!,
        start_date: formData.startDate,
        end_date: formData.endDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        notes: formData.notes,
        status: "pending",
      });

      toast.success("Booking created successfully!");
      router.push("/bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
          <div className="text-center">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!room) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
          <div className="text-center text-red-600">Room not found</div>
        </div>
      </MainLayout>
    );
  }

  // Generate date options (next 30 days)
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      dates.push({ value: dateStr, label: date.toLocaleDateString() });
    }
    return dates;
  };

  // Generate time options (hourly)
  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = String(i).padStart(2, "0");
      const timeStr = `${hour}:00`;
      times.push({ value: timeStr, label: timeStr });
    }
    return times;
  };

  const dateOptions = generateDateOptions();
  const timeOptions = generateTimeOptions();

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
        <h1 className="text-3xl md:text-4xl font-heading text-white mb-8 tracking-tight">Booking Request</h1>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl">
          <div className="mb-6 pb-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white mb-2">{room.name}</h2>
            <p className="text-slate-300 leading-relaxed">{room.description}</p>
            <div className="mt-4 flex gap-4 text-sm">
              <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <span className="font-bold text-hima-link">Capacity:</span> <span className="text-white">{room.capacity} people</span>
              </div>
              <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <span className="font-bold text-hima-link">Location:</span> <span className="text-white">{room.location}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">Start Date</label>
                <div className="relative">
                  <select
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-hima-secondary focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-black/30"
                    required
                  >
                    <option value="" className="bg-slate-800 text-slate-400">Select start date</option>
                    {dateOptions.map((date) => (
                      <option key={date.value} value={date.value} className="bg-slate-800">
                        {date.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">End Date</label>
                <div className="relative">
                  <select
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-hima-secondary focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-black/30"
                    required
                  >
                    <option value="" className="bg-slate-800 text-slate-400">Select end date</option>
                    {dateOptions.map((date) => (
                      <option key={date.value} value={date.value} className="bg-slate-800">
                        {date.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">Start Time</label>
                <div className="relative">
                  <select
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-hima-secondary focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-black/30"
                  >
                    {timeOptions.map((time) => (
                      <option key={time.value} value={time.value} className="bg-slate-800">
                        {time.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">End Time</label>
                <div className="relative">
                  <select value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-hima-secondary focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-black/30">
                    {timeOptions.map((time) => (
                      <option key={time.value} value={time.value} className="bg-slate-800">
                        {time.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add specific requirements or meeting purpose..."
                rows={4}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-hima-secondary focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-hima-secondary text-white py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:shadow-lg hover:shadow-hima-secondary/20 border border-transparent hover:border-white/10 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {submitting ? "Processing Request..." : "Submit Booking Request"}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
            <div className="text-center">Loading...</div>
          </div>
        </MainLayout>
      }
    >
      <CreateBookingPageContent />
    </Suspense>
  );
}
