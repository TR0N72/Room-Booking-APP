import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateToken(): string {
  // Use crypto for secure token generation
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(time: string): string {
  return time.substring(0, 5);
}

export function isTimeSlotAvailable(startTime: string, endTime: string, unavailableSlots: any[]): boolean {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  for (const slot of unavailableSlots) {
    const [slotStartHour, slotStartMin] = slot.start_time.split(":").map(Number);
    const [slotEndHour, slotEndMin] = slot.end_time.split(":").map(Number);
    const slotStartMinutes = slotStartHour * 60 + slotStartMin;
    const slotEndMinutes = slotEndHour * 60 + slotEndMin;

    if ((startMinutes >= slotStartMinutes && startMinutes < slotEndMinutes) || (endMinutes > slotStartMinutes && endMinutes <= slotEndMinutes) || (startMinutes <= slotStartMinutes && endMinutes >= slotEndMinutes)) {
      return false;
    }
  }

  return true;
}

export function generateTimeSlots(startHour: number = 6, endHour: number = 22): string[] {
  const slots: string[] = [];
  for (let i = startHour; i < endHour; i++) {
    slots.push(`${String(i).padStart(2, "0")}:00`);
  }
  return slots;
}

export function getNextDays(days: number = 30): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
}
