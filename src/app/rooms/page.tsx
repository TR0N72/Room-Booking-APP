"use client";

import { useEffect, useState } from "react";
import { roomService } from "@/services/rooms";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoomCard } from "@/components/RoomCard";
import { Room } from "@/types";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const allRooms = await roomService.getAllRooms();
        setRooms(allRooms);
      } catch (error) {
        console.error("Error loading rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  const filteredRooms = rooms.filter(
    (room) => room.name.toLowerCase().includes(searchQuery.toLowerCase()) || room.description.toLowerCase().includes(searchQuery.toLowerCase()) || room.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Available Rooms</h1>
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-hima-secondary"
            />
          </div>

          {loading ? (
            <p className="text-slate-300">Loading rooms...</p>
          ) : filteredRooms.length === 0 ? (
            <p className="text-slate-300">No rooms found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
