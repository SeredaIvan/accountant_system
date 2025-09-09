import { DishWithProducts } from "@/types/DishWithProducts";
import SelectedProducts from "./SelectedProducts";

type DishTileProps = {
  dish: DishWithProducts;
};

export function DishTile({ dish }: DishTileProps) {

  return (
    <div className="flex justify-between items-center bg-white px-4 py-3 hover:bg-gray-50">
      <span className="w-1/3 font-medium text-gray-800">{dish.name}</span>
      <SelectedProducts 
        dish = {dish}
        action="view" 
      />
    </div>
  );
}
