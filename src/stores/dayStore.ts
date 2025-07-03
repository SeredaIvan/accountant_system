import { Dish } from "@/generated/prisma";
import { create } from "zustand";

interface DayStore {
  day: number;
  setDay: (day: number) => void;

  month: number;
  setMonth: (month: number) => void;

  year: number;
  setYear: (year: number) => void;

  dishes: Dish[];
  setDishes: (dishes: Dish[]) => void;
}

export const useDayStore = create<DayStore>((set) => ({
  day: new Date().getDate(),
  setDay: (day) => set({ day }),

  month: new Date().getMonth(),
  setMonth: (month) => set({ month }),

  year: new Date().getFullYear(),
  setYear: (year) => set({ year }),

  dishes: [],
  setDishes: (dishes) => set({ dishes }),
}));
