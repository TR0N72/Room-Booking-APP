export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "admin";
  created_at: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  location: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  token?: string;
  token_expires_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  rooms?: Room;
}

export interface BookingToken {
  id: string;
  booking_id: string;
  token: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

export interface TimeSlot {
  date: string;
  time: string;
}

export interface UnavailableSlot {
  date: string;
  time: string;
  room_id: string;
}
