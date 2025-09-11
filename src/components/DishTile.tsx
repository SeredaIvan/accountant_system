import { DishWithProducts } from "@/types/DishWithProducts";
import SelectedProducts from "./SelectedProducts";

type DishTileProps = {
  dish: DishWithProducts;
  handleRemoveSelectedDish: (id: string) => void;
};

export function DishTile({ dish, handleRemoveSelectedDish }: DishTileProps) {
  return (
    <div className="flex justify-between items-center bg-white px-4 py-3 hover:bg-gray-50">
      <span className="w-1/3 font-medium text-gray-800">{dish.name}</span>
      <SelectedProducts dish={dish} action="view" />
      <button
        onClick={() => handleRemoveSelectedDish(dish.id)}
        className="text-red-600 hover:text-red-800 font-bold ml-4"
        aria-label={`Видалити ${dish.name}`}
      >
        ×
      </button>
    </div>
  );
}
