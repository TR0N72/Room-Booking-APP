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
      <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-hima-secondary/10 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-hima-secondary/0 via-hima-secondary/0 to-hima-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {room.image_url && (
          <div className="w-full h-48 bg-slate-800 rounded-xl mb-5 overflow-hidden relative shadow-inner">
            <div className="absolute inset-0 bg-hima-main/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
            <img
              src={room.image_url}
              alt={room.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col relative z-10">
          <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-hima-link transition-colors">{room.name}</h3>
          <p className="text-slate-300 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">{room.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm border-t border-white/10 pt-4 mt-auto">
            <div>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Capacity</p>
              <p className="font-semibold text-white/90">{room.capacity} Persons</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Location</p>
              <p className="font-semibold text-white/90">{room.location}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
