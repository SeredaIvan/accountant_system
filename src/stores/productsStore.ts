import { Product } from "@/types/Product";
import { create } from "zustand";

interface ProductStore {
  products: Product[] | null;
  setProducts: (products: Product[]) => void;
}

export const useProductsStore = create<ProductStore>((set) => ({
  products: null,
  setProducts: (products) => set({ products }),
}));
