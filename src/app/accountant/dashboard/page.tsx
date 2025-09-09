"use client";
import { DayForm } from "@/components/DayForm";
import { MessageBox } from "@/components/MessageBox";
import { DaysTabBar } from "@/components/TabBar";

import { useEffect, useState, useContext } from "react";
/* STORES */
import { useDishesStore } from "@/stores/dishesStore";
import { useDaysStore } from "@/stores/daysStore";
/* DATEPICKER */
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
/* FETCHERS */
import getAllDishes from "@/fetchers/getAllDishes";
import getDayInfo from "@/fetchers/getDayInfo";
import { DayWithDishes } from "@/types/DayWithDishes";
/* ErrorsContext */
import ErrorContext from "@/contexts/ErrorContext";

interface DayTab {
  id: number;
  label: string;
  content: string;
}

const DashboardPage = () => {
  const { errors, setErrors } = useContext(ErrorContext);

  const [loading, setLoading] = useState<boolean>(false);

  const dayData = useDaysStore((state) => state.days);
  const setDayData = useDaysStore((state) => state.setDays);

  const dishes = useDishesStore((state) => state.dishes);
  const setDishes = useDishesStore((state) => state.setDishes);

  const today = new Date();
  const [activeTab, setActiveTab] = useState<number>(today.getDate());
  const [startDate, setStartDate] = useState<Date>(new Date());

  const daysArr: DayTab[] = getArrayOfDays();

  useEffect(() => {
    async function fetchDay() {
      setLoading(true);
      setErrors(null);

      const data = await getDayInfo(
        activeTab,
        today.getMonth() + 1,
        today.getFullYear()
      );

      if ("error" in data) {
        setErrors((prev) => [...(prev ?? []), ...normalizeErrors(data.error)]);
      } else {
        setDayData(data);
        console.log(data)
      }
      setLoading(false);
    }

    fetchDay();
  }, [activeTab]);

  useEffect(() => {
    (async()=>{const data = await getAllDishes()
      setLoading(true)
      if("error" in data){
        setErrors(["Несподівана помилка при завантаженні страв"]);
        setLoading(false)
      } 
      else{
        setDishes(dishes)
        setLoading(false)
      }
    })()
  }, []);

  return (
    <div>
      <div>
        <DaysTabBar
          tabs={daysArr}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {errors && <MessageBox messages={errors} type="error" />}

        {/* Вміст активної вкладки */}
        {loading ? (
          <p>Завантаження...</p>
        ) : dayData && dishes ? (
          <div>
            <DayForm />
          </div>
        ) : (
          daysArr.find((tab) => tab.id === activeTab)?.content
        )}
      </div>
    </div>
  );

  function getArrayOfDays() {
    const days = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => ({
      id: i + 1,
      label: String(i + 1),
      content: `Вміст для дня ${i + 1}`,
    }));
  }
  function normalizeErrors(err: unknown): string[] {
    if (Array.isArray(err)) {
      return err.map((e) => (typeof e === "string" ? e : JSON.stringify(e)));
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
};

export default DashboardPage;
