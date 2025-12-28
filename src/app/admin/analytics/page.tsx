"use client";

import { BarChart3, CalendarCheck, Activity, Clock } from "lucide-react";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/common/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { analyticsService, DashboardStats, RoomPopularity, BookingStatusDistribution, MonthlyActivity } from "@/services/analytics";
import { authService } from "@/services/auth";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line
} from 'recharts';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [roomPopularity, setRoomPopularity] = useState<RoomPopularity[]>([]);
    const [statusDist, setStatusDist] = useState<BookingStatusDistribution[]>([]);
    const [monthlyActivity, setMonthlyActivity] = useState<MonthlyActivity[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (!user) return; // Should redirect via ProtectedRoute

                const [dashboardStats, popularity, distribution, activity] = await Promise.all([
                    analyticsService.getDashboardStats(),
                    analyticsService.getRoomPopularity(),
                    analyticsService.getBookingStatusDistribution(),
                    analyticsService.getMonthlyActivity()
                ]);

                setStats(dashboardStats);
                setRoomPopularity(popularity);
                setStatusDist(distribution);
                setMonthlyActivity(activity);
            } catch (error) {
                console.error("Failed to load analytics", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <ProtectedRoute>
                <MainLayout>
                    <div className="flex justify-center items-center h-screen">
                        <p className="text-xl">Loading Analytics...</p>
                    </div>
                </MainLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <MainLayout>
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center mb-8">
                        <BarChart3 className="w-8 h-8 text-white mr-3" />
                        <h1 className="text-3xl text-white">Analytics Dashboard</h1>
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 border-l-4 border-l-blue-500">
                            <div>
                                <CalendarCheck className="w-5 h-5 text-blue-400 mb-2" />
                            </div>
                            <p className="text-slate-400 text-sm font-medium">Total Bookings</p>
                            <p className="text-3xl font-bold text-white">{stats?.totalBookings}</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 border-l-4 border-l-purple-500">
                            <div>
                                <Activity className="w-5 h-5 text-purple-400 mb-2" />
                            </div>
                            <p className="text-slate-400 text-sm font-medium">Utilization Rate</p>
                            <p className="text-3xl font-bold text-white">{stats?.utilizationRate}%</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 border-l-4 border-l-orange-500">
                            <div>
                                <Clock className="w-5 h-5 text-orange-400 mb-2" />
                            </div>
                            <p className="text-slate-400 text-sm font-medium">Avg Duration</p>
                            <p className="text-3xl font-bold text-white">{stats?.averageBookingDuration} hrs</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Room Popularity Chart */}
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                            <h2 className="text-xl font-bold mb-6 text-white">Most Popular Rooms</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={roomPopularity}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                        <XAxis dataKey="name" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                            itemStyle={{ color: '#f8fafc' }}
                                        />
                                        <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Bookings" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Booking Status Distribution */}
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                            <h2 className="text-xl font-bold mb-6 text-white">Booking Status</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusDist}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label
                                        >
                                            {statusDist.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                            itemStyle={{ color: '#f8fafc' }}
                                        />
                                        <Legend wrapperStyle={{ color: '#94a3b8' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Activity */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 mb-8">
                        <h2 className="text-xl font-bold mb-6 text-white">Monthly Activity Trends</h2>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyActivity}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                    <XAxis dataKey="month" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Legend wrapperStyle={{ color: '#94a3b8' }} />
                                    <Line type="monotone" dataKey="bookings" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} name="Bookings" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </MainLayout>
        </ProtectedRoute>
    );
}
