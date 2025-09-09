
import { DayWithDishes } from "@/types/DayWithDishes";
import { create } from "zustand";

interface DaysStore {
  days : DayWithDishes | null
  setDays: (days: DayWithDishes) => void;
}

export const useDaysStore = create<DaysStore>((set) => ({
  days: null,
  setDays: (days) => set({ days }),
}));
