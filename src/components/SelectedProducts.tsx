import { DishWithProducts } from "@/types/DishWithProducts";

type SelectedProductsProps = {
  dish: DishWithProducts;
  action: "view" | "edit";
  updateWeight?: (productId: string, weight: number | "") => void;
  removeProduct?: (productId: string) => void;
};

export const SelectedProducts = ({
  dish,
  action,
  updateWeight,
  removeProduct,
}: SelectedProductsProps) => {
  return (
    <div>
      <h2 className="font-semibold text-lg mb-2 mt-4">Обрані продукти:</h2>
      <ul className="space-y-3">
        {dish.products.map((p) => (
          <li key={p.productId} className="flex items-center gap-3">
            <span className="flex-1">{p.name}</span>

            {action === "edit" ? (
              <>
                <input
                  type="number"
                  min={1}
                  placeholder="Вага (г)"
                  className="w-24 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={p.weight === "" ? "" : p.weight}
                  onChange={(e) =>
                    updateWeight?.(p.productId, Number(e.target.value))
                  }
                />
                <button
                  type="button"
                  onClick={() => removeProduct?.(p.productId)}
                  className="text-red-600 hover:text-red-800 font-bold"
                  aria-label={`Видалити продукт ${p.name}`}
                >
                  ×
                </button>
              </>
            ) : (
              <span className="text-gray-700">{p.weight} г</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SelectedProducts;
