import { DishWithProducts } from "@/types/DishWithProducts";
import { Product } from "@/types/Product";
import { DishProduct } from "@/types/DishProduct";
import { SelectedProduct } from "@/types/SelectedProducts";

import { useProductsStore } from "@/stores/productsStore";
import { useState, useEffect } from "react";

type SelectedProductsProps = {
  dish?: DishWithProducts;
  selectedProducts?: SelectedProduct[];
  action: "view" | "edit";
  updateWeight?: (productId: string, weight: number | "") => void;
  removeProduct?: (productId: string) => void;
};

export const SelectedProducts = ({
  dish,
  selectedProducts,
  action,
  updateWeight,
  removeProduct,
}: SelectedProductsProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const storedProducts: Product[] | null = useProductsStore(
    (state) => state.products
  );

  useEffect(() => {
    if (dish && storedProducts) {
      const selectedIds = new Set(dish.products.map((p) => p.productId));
      setFilteredProducts(
        storedProducts.filter((product) => selectedIds.has(product.id))
      );
    }
  }, [dish, storedProducts]);

  if (dish) {
    const dishProducts = new Map<string, DishProduct>(
      dish.products.map((p) => [`${p.productId}`, p])
    );
    console.log("filteredProducts",filteredProducts)
    console.log("dishProducts",dishProducts)
    console.log("storedProducts",storedProducts)
    return (
      <div>
        <h2 className="font-semibold text-lg mb-2 mt-4">Обрані продукти:</h2>
        <ul className="space-y-3">
          {filteredProducts.map((p) => (
            <li key={p.id} className="flex items-center gap-3">
              <span className="flex-1">{p.name}</span>

              {action === "edit" ? (
                <>
                  <input
                    type="number"
                    min={1}
                    placeholder="Вага (г)"
                    className="w-24 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={dishProducts.get(p.id)?.weight ?? ""}
                    onChange={(e) =>
                      updateWeight?.(p.id, Number(e.target.value))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeProduct?.(p.id)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    ×
                  </button>
                </>
              ) : (
                <span className="text-gray-700">
                  {dishProducts.get(p.id)?.weight} г
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (selectedProducts) {
    return (
      <div>
        <h2 className="font-semibold text-lg mb-2 mt-4">Обрані продукти:</h2>
        <ul className="space-y-3">
          {selectedProducts.map((p) => (
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
  }

  return null;
};

export default SelectedProducts;
