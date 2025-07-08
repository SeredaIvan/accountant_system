"use client";
import { DayForm } from "@/components/DayForm";
import { MessageBox } from "@/components/MessageBox";
import { DaysTabBar } from "@/components/TabBar";
import { Day, Dish, DishProduct, Product } from "@/generated/prisma";
import { DayWithFullDishes } from "@/types/DayWithFullDishes";
import { useEffect, useState } from "react";
import { useDishesStore } from "@/stores/dishesStore";
import { useDaysStore } from "@/stores/daysStore";

interface DayTab {
  id: number;
  label: string;
  content: string;
}

const DashboardPage = () => {
  const [errors, setErrors] = useState<string[] | null>(null);
  const [loading ,setLoading] = useState<boolean>(false)
  
  const dayData = useDaysStore((state)=>state.days)
  const setDayData = useDaysStore((state)=>state.setDays)
  
  const dishes = useDishesStore((state)=>state.dishes)
  const setDishes = useDishesStore((state)=>state.setDishes)

  const today = new Date();
  const [activeTab, setActiveTab] = useState<number>(today.getDate());

  async function getDishes() {
  try {
    const res = await fetch("/api/v1.0/dishes/get-all", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      setDishes(data.dishes || []);
    } else {
      setErrors(["Помилка отримання страв"]);
    }
  } catch (error) {
    console.log(error);
    setErrors(["Несподівана помилка при завантаженні страв"]);
  }
}


  async function getDayInfo(day: number, month: number, year: number): Promise<DayWithFullDishes | null> {

  setErrors(null);
  console.log(year,day,month)
  try {
    const res = await fetch(`/api/v1.0/days/${day}-${month}-${year}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    console.log(new Date(year, day , month).toISOString(),)
    if (!res.ok) {

      const result = await fetch("/api/v1.0/days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(year, month - 1, day).toISOString(),
          countKids: 0,
          dishes: [],
        }),
      });

      if (!result.ok) {
        setErrors(prev => [...(prev ?? []), "Помилка створення дня"]);
        return null;
      }

      const createdData = await result.json();
      return createdData.dayData ?? null;
    }

    const data = await res.json();

    if (data.error) {
      setErrors(normalizeErrors(data.error));
    }
    return data.dayData ?? null;
  } catch (e) {
    setErrors(["Несподівана помилка"]);
    return null;
  }
}
  const daysArr: DayTab[] = getArrayOfDays();

  useEffect(() => {
    async function fetchDay() {
      setLoading(true);
      console.log("active" , activeTab)
      const data:DayWithFullDishes|null= await getDayInfo(activeTab, today.getMonth() + 1, today.getFullYear());
      if(data){
        setDayData(data);
        setLoading(false);
      }
    }
    fetchDay();
  }, [activeTab]);

  useEffect(() => {
    async function fetchDishes() {
      await getDishes();
    }
    fetchDishes();
  },[]);

  /*useEffect(() => {
    console.log(dishes)
  }, [dishes]);
    useEffect(() => {
    console.log(dayData)
  }, [dayData]);
*/
  return (
    <div>
      <DaysTabBar tabs={daysArr} activeTab={activeTab} setActiveTab={setActiveTab} />

      {errors && <MessageBox messages={errors} type="error" />}

      {/* Вміст активної вкладки */}
        {loading ? (
          <p>Завантаження...</p>
        ) : dayData&&dishes ? (
          <div>
            <DayForm />
          </div>
        ) : (
          daysArr.find(tab => tab.id === activeTab)?.content
        )}
    </div>
  );
  function getArrayOfDays() {
    const days = daysInMonth(today.getFullYear(), today.getMonth());
    return Array.from({ length: days }, (_, i) => ({
      id: i + 1,
      label: String(i + 1),
      content: `Вміст для дня ${i + 1}`,
    }));
  }
    function normalizeErrors(err: unknown): string[] {
    if (Array.isArray(err)) {
      return err.map(e => (typeof e === "string" ? e : JSON.stringify(e)));
    }
    if (typeof err === "string") {
      return [err];
    }
    try {
      return [JSON.stringify(err)];
    } catch {
      return ["Unknown error"];
    }
  }

  function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }
  
};

export default DashboardPage;
