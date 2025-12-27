import { supabase } from "@/lib/supabase";
import { User } from "@/types";

const MOCK_ADMIN: User = {
  id: "mock-admin-id",
  email: "admin@demo.com",
  full_name: "Demo Admin",
  role: "admin",
  created_at: new Date().toISOString(),
};

const MOCK_USER: User = {
  id: "mock-user-id",
  email: "user@demo.com",
  full_name: "Demo User",
  role: "user",
  created_at: new Date().toISOString(),
};

const MOCK_SESSION_KEY = "room_booking_mock_session";
const MOCK_USER_ROLE_KEY = "room_booking_mock_role";

export const authService = {
  async register(email: string, password: string, fullName: string) {
    if (!supabase) {
      // Mock Mode
      console.log("Mock Register:", { email, fullName });
      // Simulate login immediately
      if (typeof window !== "undefined") {
        localStorage.setItem(MOCK_SESSION_KEY, "true");
        localStorage.setItem(MOCK_USER_ROLE_KEY, "user");
      }
      return { success: true, user: { ...MOCK_USER, email, full_name: fullName } };
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role: "user",
        });

        if (profileError) throw profileError;
      }

      return { success: true, user: authData?.user };
    } catch (error) {
      throw error;
    }
  },

  async login(email: string, password: string) {
    if (!supabase) {
      // Mock Mode
      console.log("Mock Login:", email);
      if (typeof window !== "undefined") {
        localStorage.setItem(MOCK_SESSION_KEY, "true");
        // Simple logic: if email contains "admin", log them in as admin
        const isAdmin = email.toLowerCase().includes("admin");
        localStorage.setItem(MOCK_USER_ROLE_KEY, isAdmin ? "admin" : "user");

        return {
          success: true,
          user: isAdmin ? MOCK_ADMIN : { ...MOCK_USER, email }
        };
      }
      return { success: true, user: MOCK_USER };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, user: data?.user };
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    if (!supabase) {
      // Mock Mode
      if (typeof window !== "undefined") {
        localStorage.removeItem(MOCK_SESSION_KEY);
        localStorage.removeItem(MOCK_USER_ROLE_KEY);
      }
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    if (!supabase) {
      // Mock Mode
      if (typeof window !== "undefined" && localStorage.getItem(MOCK_SESSION_KEY)) {
        const role = localStorage.getItem(MOCK_USER_ROLE_KEY);
        return role === "admin" ? MOCK_ADMIN : MOCK_USER;
      }
      return null;
    }

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) return null;
      return data?.user;
    } catch (error) {
      return null;
    }
  },

  async getUserProfile(userId: string): Promise<User | null> {
    if (!supabase) {
      // Mock Mode
      if (userId === MOCK_ADMIN.id) return MOCK_ADMIN;
      return MOCK_USER;
    }

    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

      if (error) return null;
      return data;
    } catch (error) {
      return null;
    }
  },

  async onAuthStateChange(callback: (user: any) => void) {
    if (!supabase) {
      // Mock Mode - just call back once if session exists
      if (typeof window !== "undefined" && localStorage.getItem(MOCK_SESSION_KEY)) {
        callback(MOCK_USER);
      } else {
        callback(null);
      }
      return { unsubscribe: () => { } };
    }

    const { data } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      callback(session?.user || null);
    });

    return data?.subscription;
  },
};
