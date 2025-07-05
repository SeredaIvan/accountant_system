
import { DishWithProducts } from "@/types/DishWithProducts";
import { create } from "zustand";

interface DishesStore {
  dishes : DishWithProducts[] 
  setDishes: (dishes: DishWithProducts[]) => void;
}

export const useDishesStore = create<DishesStore>((set) => ({
  dishes: [],
  setDishes: (dishes) => set({ dishes }),
}));
