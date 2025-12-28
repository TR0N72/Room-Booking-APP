"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { roomService } from "@/services/rooms";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Room } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: 1,
    location: "",
    image_url: "",
  });

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

        const allRooms = await roomService.getAllRooms();
        setRooms(allRooms);
      } catch (error) {
        console.error("Error loading rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location) {
      toast.error("Name and location are required");
      return;
    }

    try {
      if (editingRoom) {
        const updated = await roomService.updateRoom(editingRoom.id, formData);
        setRooms(rooms.map((r) => (r.id === updated.id ? updated : r)));
        toast.success("Room updated successfully");
      } else {
        const created = await roomService.createRoom(formData as any);
        setRooms([...rooms, created]);
        toast.success("Room created successfully");
      }

      setFormData({
        name: "",
        description: "",
        capacity: 1,
        location: "",
        image_url: "",
      });
      setEditingRoom(null);
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save room");
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description,
      capacity: room.capacity,
      location: room.location,
      image_url: room.image_url || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        await roomService.deleteRoom(id);
        setRooms(rooms.filter((r) => r.id !== id));
        toast.success("Room deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete room");
      }
    }
  };

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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Manage Rooms</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingRoom(null);
                setFormData({
                  name: "",
                  description: "",
                  capacity: 1,
                  location: "",
                  image_url: "",
                });
              }}
              className="bg-hima-secondary text-white px-4 py-2 rounded-lg hover:bg-white/10 hover:shadow-lg transition-all"
            >
              {showForm ? "Cancel" : "+ Add Room"}
            </button>
          </div>

          {showForm && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 text-white">
              <h2 className="text-2xl font-bold text-white mb-6">{editingRoom ? "Edit Room" : "Create New Room"}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Room Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-hima-secondary text-white placeholder-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-hima-secondary text-white placeholder-slate-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Capacity (persons)</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-hima-secondary text-white placeholder-slate-500"
                    min="1"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-hima-secondary text-white placeholder-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Room Image</label>

                  {/* File Upload Input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image_url: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-hima-secondary text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-hima-secondary file:text-white hover:file:bg-white/20"
                  />

                  {/* Preview */}
                  {formData.image_url && (
                    <div className="mt-4 relative w-full h-48 bg-black/20 rounded-lg overflow-hidden border border-white/10">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: "" })}
                        className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full bg-hima-secondary text-white py-2 rounded-lg font-medium hover:bg-white/20 transition-all border border-transparent hover:border-white/10">
                  {editingRoom ? "Update Room" : "Create Room"}
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-bold text-white mb-2">{room.name}</h3>
                <p className="text-slate-300 text-sm mb-3 line-clamp-2">{room.description}</p>

                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <p className="text-slate-400">Capacity</p>
                    <p className="font-semibold text-white">{room.capacity} persons</p>
                  </div>

                </div>

                <p className="text-slate-400 text-xs mb-4">📍 {room.location}</p>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(room)} className="flex-1 bg-hima-secondary/80 text-white py-2 rounded hover:bg-hima-secondary text-sm font-medium transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="flex-1 bg-red-600/80 text-white py-2 rounded hover:bg-red-600 text-sm font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {rooms.length === 0 && !showForm && <p className="text-center text-slate-400">No rooms yet. Create one to get started!</p>}
        </div>
      </MainLayout >
    </ProtectedRoute >
  );
}
