import { supabase } from "@/lib/supabase";
import { Booking } from "@/types";
import { generateToken, isTimeSlotAvailable } from "@/lib/utils";

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1",
    user_id: "mock-admin-id",
    room_id: "1",
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    start_time: "09:00",
    end_time: "11:00",
    status: "approved",
    notes: "Team Sync",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rooms: {
      id: "1",
      name: "RBC",
      description: "Large conference hall",
      capacity: 50,
      location: "Floor 1",
      created_at: "",
      updated_at: ""
    }
  }
];

export const bookingService = {
  async createBooking(booking: Omit<Booking, "id" | "created_at" | "updated_at">) {
    if (!supabase) {
      return { ...booking, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    }
    try {
      // Check for time slot conflicts before creating booking
      const unavailableSlots = await this.getUnavailableSlots(booking.room_id, booking.start_date);
      if (!isTimeSlotAvailable(booking.start_time, booking.end_time, unavailableSlots)) {
        throw new Error("Time slot is already booked. Please choose a different time.");
      }

      const { data, error } = await supabase.from("bookings").insert([booking]).select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    if (!supabase) return MOCK_BOOKINGS;
    try {
      const { data, error } = await supabase.from("bookings").select("*, rooms(*)").eq("user_id", userId).order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async getAllBookings(): Promise<Booking[]> {
    if (!supabase) return MOCK_BOOKINGS;
    try {
      const { data, error } = await supabase.from("bookings").select("*, rooms(*)").order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async getBookingById(id: string): Promise<Booking | null> {
    if (!supabase) return MOCK_BOOKINGS.find(b => b.id === id) || null;
    try {
      // Include room data for consistency with other booking queries
      const { data, error } = await supabase.from("bookings").select("*, rooms(*)").eq("id", id).single();

      if (error) throw error;
      return data;
    } catch (error) {
      return null;
    }
  },

  async updateBookingStatus(id: string, status: string) {
    if (!supabase) return { id, status };
    try {
      const { data, error } = await supabase.from("bookings").update({ status, updated_at: new Date().toISOString() }).eq("id", id).select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async approveBooking(id: string, expiresAt: string) {
    if (!supabase) return { id, status: "approved", token: generateToken() };
    try {
      const token = generateToken();

      const { data, error } = await supabase
        .from("bookings")
        .update({
          status: "approved",
          token,
          token_expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async rejectBooking(id: string) {
    if (!supabase) return { id, status: "rejected" };
    try {
      const { data, error } = await supabase
        .from("bookings")
        .update({
          status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getUnavailableSlots(roomId: string, date: string) {
    if (!supabase) return [];
    try {
      // Check for bookings that overlap with the given date (supports multi-day bookings)
      const { data, error } = await supabase
        .from("bookings")
        .select("start_time, end_time, start_date, end_date")
        .eq("room_id", roomId)
        .lte("start_date", date)  // Booking starts on or before the date
        .gte("end_date", date)    // Booking ends on or after the date
        .in("status", ["approved", "pending"]);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async getBookingsByRoomId(roomId: string): Promise<Booking[]> {
    if (!supabase) return MOCK_BOOKINGS.filter(b => b.room_id === roomId);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("room_id", roomId)
        .in("status", ["approved", "pending"]);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async deleteBooking(id: string) {
    if (!supabase) return { success: true };
    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};
