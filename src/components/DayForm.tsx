import { useEffect, useState } from "react";
import { DishTile } from "./DishTile";
import { useDishesStore } from "@/stores/dishesStore";
import { useDaysStore } from "@/stores/daysStore";
import { DishWithProducts } from "@/types/DishWithProducts";
import { DayWithFullDishes } from "@/types/DayWithFullDishes";

export function DayForm() {
  const dayData: DayWithFullDishes | null = useDaysStore((state) => state.days);
  const setDayData = useDaysStore((state) => state.setDays);

  const dishes: DishWithProducts[] = useDishesStore((state) => state.dishes ?? []);
  const setDishes = useDishesStore((state) => state.setDishes);

  const [countKids, setCountKids] = useState<number>(dayData?.countKids || 0);
  const [selectedDishId, setSelectedDishId] = useState<string>("");
  const [selectedDishes, setSelectedDishes] = useState<DishWithProducts[]>([]);

  useEffect(() => {
    if (dayData) {
      setCountKids(dayData.countKids || 0);
      setSelectedDishes(dayData.dishes || []);
    }
  }, [dayData]);
  useEffect(()=>console.log(selectedDishes),[selectedDishes])
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedDish = dishes.find((d) => d.id === selectedId);
    if (selectedDish && !selectedDishes.find((d) => d.id === selectedDish.id)) {
      setSelectedDishes((prev) => [...prev, selectedDish]);
    }
    setSelectedDishId("");
  };

  const availableDishes = dishes.filter(
    (d) => !selectedDishes.find((sd) => sd.id === d.id)
  );

  if (!dayData) return null;

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-md shadow-md">
      <p className="mb-4 text-lg font-semibold text-gray-700">
        Дата: {formatDateToDMY(new Date(dayData.date))}
      </p>

      <label htmlFor="countKids" className="block mb-1 font-medium text-gray-600">
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
        <label htmlFor="dishSelect" className="block mb-1 font-medium text-gray-600">
          Додати страву:
        </label>
        <select
          id="dishSelect"
          value={selectedDishId}
          onChange={handleSelectChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value="" disabled>
            Оберіть страву
          </option>
          {availableDishes.map((dish) => (
            <option key={dish.id} value={dish.id}>
              {dish.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold text-gray-700">Обрані страви:</h3>
        <div className="border rounded-md divide-y divide-gray-200 overflow-hidden shadow-sm">
          {selectedDishes.length === 0 && (
            <p className="p-4 text-gray-500 text-center">Страви не обрано</p>
          )}
          {selectedDishes.map((dish) => (
            <DishTile key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </div>
  );

  function formatDateToDMY(dateInput: string | Date): string {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const day = d.getUTCDate().toString().padStart(2, "0");
    const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }
}
