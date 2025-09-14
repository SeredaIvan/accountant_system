import { useCallback, useEffect, useState } from "react";
import { useDishesStore } from "@/stores/dishesStore";
import { useDaysStore } from "@/stores/daysStore";
import { DishWithProducts } from "@/types/DishWithProducts";
import { DayWithDishes } from "@/types/DayWithDishes";
import SelectedDishes from "./SelectedDishes";

export function DayForm() {
  const dayData: DayWithDishes | null = useDaysStore((state) => state.days);

  const dishes: DishWithProducts[] = useDishesStore(
    (state) => state.dishes ?? []
  );

  const [countKids, setCountKids] = useState<number>(dayData?.countKids || 0);

  const [selectedDishes, setSelectedDishes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (dayData) {
      setCountKids(dayData.countKids || 0);
      if (dayData.dayDishes) {
        setSelectedDishes(new Set(dayData.dayDishes.map((dish) => dish.dishId)));
      }
    }
  }, [dayData]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedDishes((prev) => {
      const newSet = new Set(prev);
      newSet.add(selectedId);
      return newSet;
    });
  };

  const handleRemoveSelectedDish = useCallback((id: string) => {
    setSelectedDishes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  if (!dayData) return <></>; 
  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-md shadow-md">
      <p className="mb-4 text-lg font-semibold text-gray-700">
        Дата: {new Date(dayData.date).toLocaleDateString("uk-UA")}
      </p>

      <label
        htmlFor="countKids"
        className="block mb-1 font-medium text-gray-600"
      >
        Кількість дітей:
      </label>
      <input
        id="countKids"
        name="countKids"
        type="number"
        min={0}
        value={countKids === 0 ? "" : countKids}
        onChange={(e) => setCountKids(Number(e.target.value))}
        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Введіть кількість дітей"
      />

      <div className="mb-6">
        <label
          htmlFor="dishSelect"
          className="block mb-1 font-medium text-gray-600"
        >
          Додати страву:
        </label>
        <select
          id="dishSelect"
          value={""}
          onChange={handleSelectChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value="" disabled>
            Оберіть страву
          </option>
          {dishes.map((dish) => (
            <option key={dish.id} value={dish.id}>
              {dish.name}
            </option>
          ))}
        </select>
      </div>
      <SelectedDishes
        selectedDishes={selectedDishes}
        handleRemoveSelectedDish={handleRemoveSelectedDish}
      />
    </div>
  );
}
