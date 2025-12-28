"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { User } from "@/types";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const profileData = await authService.getUserProfile(currentUser.id);
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading)
    return (
      <MainLayout>
        <div className="p-4">Loading...</div>
      </MainLayout>
    );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-4xl text-white mb-8">Profile</h1>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-sm font-medium text-slate-400 mb-2">Email</h2>
              <p className="text-lg font-semibold text-white">{user?.email}</p>
            </div>

            {profile && (
              <>
                <div className="mb-6">
                  <h2 className="text-sm font-medium text-slate-400 mb-2">Full Name</h2>
                  <p className="text-lg font-semibold text-white">{profile.full_name}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-sm font-medium text-slate-400 mb-2">Role</h2>
                  <p className="text-lg font-semibold text-white capitalize">{profile.role === "admin" ? "Administrator" : "User"}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-sm font-medium text-slate-400 mb-2">Member Since</h2>
                  <p className="text-lg font-semibold text-white">{new Date(profile.created_at).toLocaleDateString("id-ID")}</p>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
            <h3 className="text-white mb-2">About This App</h3>
            <p className="text-slate-300 mb-2">
              <strong>Room Booking System</strong> is a modern PWA application that allows users to easily book meeting rooms and conference halls.
            </p>
            <p className="text-slate-300 mb-2">
              <strong>Features:</strong>
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Browse available rooms with detailed information</li>
              <li>Book rooms with flexible time slots</li>
              <li>Real-time availability management</li>
              <li>Admin panel for room and booking management</li>
              <li>Automatic booking token generation</li>
              <li>Offline support (PWA)</li>
            </ul>
            <p className="text-slate-400 mt-4 text-sm">
              <strong>Version:</strong> 1.0.0 | <strong>Built with:</strong> Next.js, Supabase, Tailwind CSS
            </p>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
