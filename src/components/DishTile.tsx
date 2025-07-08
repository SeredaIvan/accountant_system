import { DishWithProducts } from "@/types/DishWithProducts";
import SelectedProducts from "./SelectedProducts";

type DishTileProps = {
  dish: DishWithProducts;
};

export function DishTile({ dish }: DishTileProps) {
  const mm= dish
  console.log(mm) 
  return (
    <div className="flex justify-between items-center bg-white px-4 py-3 hover:bg-gray-50">
      <span className="w-1/3 font-medium text-gray-800">{dish.name}</span>
      <SelectedProducts key={dish.id}
        selectedProducts={
          dish.products?.map((p) => ({
            productId: p.product.id,
            name: p.product.name,
            weight: 0,
          })) || []
        }
        action="view" 
      />
    </div>
  );
}
