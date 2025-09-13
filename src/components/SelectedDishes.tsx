import { DayDishType } from "@/types/DayWithDishes";
import { DishWithProducts } from "@/types/DishWithProducts";
import { useDishesStore } from "@/stores/dishesStore";
import { DishTile } from "./DishTile";
import React, { useState, useEffect, useCallback } from "react";

type SelectedDishesProps = {
  selectedDishes: Set<string>;
  handleRemoveSelectedDish:(id:string)=>void
};
function SelectedDishes({ selectedDishes ,handleRemoveSelectedDish}: SelectedDishesProps) {
  
  const dishes: DishWithProducts[] = useDishesStore(
    (state) => state.dishes ?? []
  );

  return (
    <div>
      <h3 className="mb-2 text-xl font-semibold text-gray-700">
        Обрані страви:
      </h3>
      <div className="border rounded-md divide-y divide-gray-200 overflow-hidden shadow-sm">
        {selectedDishes.size === 0 && (
          <p className="p-4 text-gray-500 text-center">Страви не обрано</p>
        )}
        {dishes.map((dish) =>
          selectedDishes.has(dish.id) ? (
            <DishTile
              key={dish.id}
              dish={dish}
              handleRemoveSelectedDish={handleRemoveSelectedDish}
            />
          ) : null
        )}
      </div>
    </div>
  );
}
export default React.memo(SelectedDishes);
