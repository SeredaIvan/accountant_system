
import { DishWithProducts } from "@/types/DishWithProducts";




export function DishTile({ dish }: { dish: DishWithProducts }) {
  return (
    <div className="flex justify-between items-center bg-white px-4 py-3 hover:bg-gray-50">
      <span className="w-1/3 font-medium text-gray-800">{dish.name}</span>
      <span className="w-1/3 text-gray-600">{dish.product}</span>
      <span className="w-1/3 text-right text-gray-700">
        {dish.weight} г
        {dish.computedWeight !== undefined && dish.computedWeight !== dish.weight && (
          <span className="text-sm text-blue-600 ml-1">({dish.computedWeight} г загалом)</span>
        )}
      </span>
    </div>
  );
}
