"use client";

import { Room } from "@/types";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/rooms/${room.id}`}>
      <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300">
        {room.image_url && (
          <div className="w-full h-40 bg-slate-800 rounded-xl mb-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors duration-300 z-10" />
            <img
              src={room.image_url}
              alt={room.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{room.name}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{room.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm border-t border-white/5 pt-4">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Capacity</p>
            <p className="font-semibold text-slate-200">{room.capacity} persons</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Location</p>
            <p className="font-semibold text-slate-200">{room.location}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
