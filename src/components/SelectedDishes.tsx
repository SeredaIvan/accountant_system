import { DayDishType } from "@/types/DayWithDishes";
import { DishWithProducts } from "@/types/DishWithProducts";
import { useDishesStore } from "@/stores/dishesStore";
import { DishTile } from "./DishTile";
import React, { useState, useEffect, useCallback } from "react";

type SelectedDishesProps = {
  selectedDishes: DayDishType[];
};
function SelectedDishes({ selectedDishes }: SelectedDishesProps) {
  const [selectedDishesSet, setSelectedDishesSet] = useState<Set<string>>(
    new Set(selectedDishes.map((dish) => dish.id))
  );
  const dishes: DishWithProducts[] = useDishesStore(
    (state) => state.dishes ?? []
  );
  const handleRemoveSelectedDish = useCallback((id: string) => {
    setSelectedDishesSet((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);
  useEffect(() => {
    setSelectedDishesSet(new Set(selectedDishes.map((dish) => dish.id)));
  }, [selectedDishes]);

  return (
    <div>
      <h3 className="mb-2 text-xl font-semibold text-gray-700">
        Обрані страви:
      </h3>
      <div className="border rounded-md divide-y divide-gray-200 overflow-hidden shadow-sm">
        {selectedDishes.length === 0 && (
          <p className="p-4 text-gray-500 text-center">Страви не обрано</p>
        )}
        {dishes.map((dish) =>
          selectedDishesSet.has(dish.id) ? (
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
