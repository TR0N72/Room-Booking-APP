import { supabase } from "@/lib/supabase";
import { Room } from "@/types";

const MOCK_ROOMS: Room[] = [
  {
    id: "1",
    name: "RBC",
    description: "Large conference hall with projector and sound system",
    capacity: 50,
    location: "Floor 1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "2",
    name: "Ruang Hima",
    description: "Cozy meeting room for small teams",
    capacity: 10,
    location: "Floor 2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: "https://images.unsplash.com/photo-1517502884422-41e157d44301?auto=format&fit=crop&q=80&w=1000",
  },
];

export const roomService = {
  async getAllRooms(): Promise<Room[]> {
    if (!supabase) return MOCK_ROOMS;
    try {
      const { data, error } = await supabase.from("rooms").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async getRoomById(id: string): Promise<Room | null> {
    if (!supabase) return MOCK_ROOMS.find(r => r.id === id) || null;
    try {
      const { data, error } = await supabase.from("rooms").select("*").eq("id", id).single();

      if (error) throw error;
      return data;
    } catch (error) {
      return null;
    }
  },

  async createRoom(room: Omit<Room, "id" | "created_at" | "updated_at">) {
    if (!supabase) return { ...room, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    try {
      const { data, error } = await supabase.from("rooms").insert([room]).select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateRoom(id: string, room: Partial<Room>) {
    if (!supabase) return { ...room, id };
    try {
      // Always update the updated_at timestamp
      const { data, error } = await supabase
        .from("rooms")
        .update({ ...room, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async deleteRoom(id: string) {
    if (!supabase) return { success: true };
    try {
      const { error } = await supabase.from("rooms").delete().eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};
