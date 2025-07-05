
import { DayWithFullDishes } from "@/types/DayWithFullDishes";
import { create } from "zustand";

interface DaysStore {
  days : DayWithFullDishes | null
  setDays: (days: DayWithFullDishes) => void;
}

export const useDaysStore = create<DaysStore>((set) => ({
  days: null,
  setDays: (days) => set({ days }),
}));
