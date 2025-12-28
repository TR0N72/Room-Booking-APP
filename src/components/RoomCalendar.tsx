"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { Booking } from "@/types";
import { format, isSameDay, parseISO } from "date-fns";
import "react-calendar/dist/Calendar.css";
// Custom styling for the calendar to match Tailwind theme
import "./RoomCalendar.css";

interface RoomCalendarProps {
    bookings: Booking[];
}

export function RoomCalendar({ bookings }: RoomCalendarProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>([]);

    // Update selected bookings when date changes
    useEffect(() => {
        const bookingsOnDate = bookings.filter((booking) =>
            isSameDay(parseISO(booking.start_date), date)
        );
        setSelectedDateBookings(bookingsOnDate);
    }, [date, bookings]);

    const tileContent = ({ date: tileDate, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const dayBookings = bookings.filter((booking) =>
                isSameDay(parseISO(booking.start_date), tileDate)
            );

            if (dayBookings.length > 0) {
                // Check if there are any approved bookings
                const hasApproved = dayBookings.some(b => b.status === "approved");
                const hasPending = dayBookings.some(b => b.status === "pending");

                return (
                    <div className="flex justify-center mt-1 gap-1">
                        {hasApproved && <div className="w-2 h-2 rounded-full bg-red-500" title="Booked" />}
                        {!hasApproved && hasPending && <div className="w-2 h-2 rounded-full bg-yellow-500" title="Pending" />}
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <h3 className="text-xl font-heading mb-4 text-white">Room Availability</h3>
                <div className="calendar-container p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                    <Calendar
                        onChange={(val) => setDate(val as Date)}
                        value={date}
                        tileContent={tileContent}
                        className="w-full border-none"
                        minDate={new Date()}
                    />
                </div>
                <div className="mt-4 flex gap-4 text-sm text-slate-400 pl-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                        <span>Pending</span>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <h3 className="text-xl font-heading mb-4 text-white">
                    Schedule for <span className="text-hima-link">{format(date, "MMMM d, yyyy")}</span>
                </h3>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 min-h-[300px] border border-white/10 shadow-inner">
                    {selectedDateBookings.length > 0 ? (
                        <div className="space-y-4">
                            {selectedDateBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className={`p-4 rounded-xl border-l-4 transition-all hover:bg-white/5 ${booking.status === 'approved'
                                        ? 'bg-white/5 border-red-500'
                                        : 'bg-white/5 border-yellow-500'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="w-full">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="font-bold text-white text-lg">
                                                    {booking.start_time} - {booking.end_time}
                                                </p>
                                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${booking.status === 'approved'
                                                    ? 'bg-red-500/20 text-red-300'
                                                    : 'bg-yellow-500/20 text-yellow-300'
                                                    }`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {booking.notes && (
                                        <p className="text-slate-400 text-sm italic border-t border-white/5 pt-2 mt-2">{booking.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                                <span className="text-2xl">✨</span>
                            </div>
                            <p className="text-lg font-medium text-slate-300">No bookings for this date</p>
                            <p className="text-sm">This room is free all day!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
