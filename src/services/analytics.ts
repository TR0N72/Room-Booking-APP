import { bookingService } from "./bookings";
import { roomService } from "./rooms";

export interface DashboardStats {
    totalBookings: number;
    utilizationRate: number;
    averageBookingDuration: number;
}

export interface RoomPopularity {
    name: string;
    bookings: number;
}

export interface BookingStatusDistribution {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
}

export interface MonthlyActivity {
    month: string;
    bookings: number;
}

export const analyticsService = {
    async getDashboardStats(): Promise<DashboardStats> {
        const bookings = await bookingService.getAllBookings();

        let totalHours = 0;

        for (const booking of bookings) {
            if (booking.status === 'approved' || booking.status === 'completed') {
                const start = parseInt(booking.start_time.split(':')[0]);
                const end = parseInt(booking.end_time.split(':')[0]);
                const duration = Math.max(1, end - start);
                totalHours += duration;
            }
        }

        const averageBookingDuration = bookings.length > 0 ? (totalHours / bookings.length) : 0;
        // Mock utilization: hours booked / (rooms * 8 hours * 30 days)
        const utilizationRate = Math.min(100, Math.round((totalHours / (2 * 8 * 30)) * 100));

        return {
            totalBookings: bookings.length,
            utilizationRate,
            averageBookingDuration: parseFloat(averageBookingDuration.toFixed(1))
        };
    },

    async getRoomPopularity(): Promise<RoomPopularity[]> {
        const bookings = await bookingService.getAllBookings();
        const rooms = await roomService.getAllRooms();
        const roomMap = new Map<string, { bookings: number; name: string }>();

        // Initialize map
        rooms.forEach(r => {
            roomMap.set(r.id, { bookings: 0, name: r.name });
        });

        for (const booking of bookings) {
            if (!roomMap.has(booking.room_id)) continue;

            const stats = roomMap.get(booking.room_id)!;
            stats.bookings += 1;
        }

        return Array.from(roomMap.values());
    },

    async getBookingStatusDistribution(): Promise<BookingStatusDistribution[]> {
        const bookings = await bookingService.getAllBookings();
        const statusCounts = {
            approved: 0,
            pending: 0,
            rejected: 0,
            cancelled: 0,
            completed: 0
        };

        bookings.forEach(b => {
            const status = b.status as keyof typeof statusCounts;
            if (statusCounts[status] !== undefined) {
                statusCounts[status]++;
            }
        });

        return [
            { name: 'Approved', value: statusCounts.approved + statusCounts.completed, color: '#16a34a' },
            { name: 'Pending', value: statusCounts.pending, color: '#ca8a04' },
            { name: 'Rejected', value: statusCounts.rejected + statusCounts.cancelled, color: '#dc2626' },
        ].filter(item => item.value > 0);
    },

    async getMonthlyActivity(): Promise<MonthlyActivity[]> {
        const bookings = await bookingService.getAllBookings();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();

        // Get last 6 months
        const activityData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(currentMonth - i);
            const monthIndex = d.getMonth();
            const monthName = months[monthIndex];
            const year = d.getFullYear();

            let count = 0;

            bookings.forEach(b => {
                const bDate = new Date(b.created_at);
                if (bDate.getMonth() === monthIndex && bDate.getFullYear() === year) {
                    count++;
                }
            });

            activityData.push({ month: monthName, bookings: count });
        }

        return activityData;
    }
};
