"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { bookingService } from "@/services/bookings";
import { roomService } from "@/services/rooms";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Booking, Room } from "@/types";
import { toast } from "sonner";
import { formatDate, formatTime } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const profile = await authService.getUserProfile(currentUser.id);
          if (profile?.role !== "admin") {
            router.push("/dashboard");
            return;
          }
        }

        const allBookings = await bookingService.getAllBookings();
        setBookings(allBookings);
      } catch (error) {
        console.error("Error loading bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleApprove = async (bookingId: string) => {
    try {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) return;

      // Calculate expiration time (end time of booking)
      const expiresAt = new Date(`${booking.start_date}T${booking.end_time}:00`).toISOString();

      await bookingService.approveBooking(bookingId, expiresAt);

      setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: "approved" } : b)));

      toast.success("Booking approved and token generated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve booking");
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await bookingService.rejectBooking(bookingId);

      // Remove from pending list (hide from admin view after rejection)
      setBookings(bookings.filter((b) => b.id !== bookingId));

      toast.success("Booking rejected and removed from pending list");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject booking");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const approvedBookings = bookings.filter((b) => b.status === "approved");

  if (loading)
    return (
      <MainLayout>
        <div className="p-4">Loading...</div>
      </MainLayout>
    );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl text-white mb-8">Manage Bookings</h1>

          <div className="mb-8">
            <h2 className="text-2xl text-white mb-4">Pending Approvals ({pendingBookings.length})</h2>

            {pendingBookings.length === 0 ? (
              <p className="text-slate-400">No pending bookings</p>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <div key={booking.id} className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg text-white">{booking.rooms?.name || "Room"}</h3>
                        <p className="text-slate-300 text-sm">
                          {formatDate(booking.start_date)} • {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>{booking.status}</span>
                    </div>

                    <div className="bg-black/20 rounded-xl p-3 mb-4 text-sm border border-white/5">
                      <p className="text-slate-300">
                        <strong>Location:</strong> {booking.rooms?.location}
                      </p>
                      <p className="text-slate-300">
                        <strong>Capacity:</strong> {booking.rooms?.capacity} persons
                      </p>
                      {booking.notes && (
                        <p className="text-slate-300">
                          <strong>Notes:</strong> {booking.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => handleApprove(booking.id)} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium transition-colors">
                        Approve
                      </button>
                      <button onClick={() => handleReject(booking.id)} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl text-white mb-4">Approved Bookings ({approvedBookings.length})</h2>

            {approvedBookings.length === 0 ? (
              <p className="text-slate-400">No approved bookings</p>
            ) : (
              <div className="space-y-4">
                {approvedBookings.map((booking) => (
                  <div key={booking.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg text-white">{booking.rooms?.name || "Room"}</h3>
                        <p className="text-slate-300 text-sm">
                          {formatDate(booking.start_date)} • {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>{booking.status}</span>
                    </div>

                    {booking.token && (
                      <div className="bg-black/20 rounded-xl p-3 mb-4 text-sm border-l-4 border-green-500">
                        <p className="text-slate-400 mb-1">
                          <strong>Token:</strong>
                        </p>
                        <p className="font-mono text-white break-all">{booking.token}</p>
                        {booking.token_expires_at && <p className="text-slate-400 text-xs mt-1">Expires: {formatDate(booking.token_expires_at)}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
