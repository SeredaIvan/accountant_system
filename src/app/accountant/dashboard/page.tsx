"use client";
import { MessageBox } from "@/components/MessageBox";
import { DaysTabBar } from "@/components/TabBar";
import { Day } from "@/generated/prisma";
import { useEffect, useState } from "react";

interface DayTab {
  id: number;
  label: string;
  content: string;
}

const DashboardPage = () => {
  const [errors, setErrors] = useState<string[] | null>(null);
  const [dayData, setDayData] = useState<Day | null>(null);
  const [loading ,setLoading] = useState<boolean>(false)
  

  const today = new Date();
    const [activeTab, setActiveTab] = useState<number>(today.getDate());
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

  async function getDayInfo(day: number, month: number, year: number): Promise<Day | null> {
  setErrors(null);
  try {
    const res = await fetch(`/api/v1.0/days/${day}-${month}-${year}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
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
      console.log("РОбимо інсерт")
      
    }
    return data.dayData ?? null;
  } catch (e) {
    setErrors(["Несподівана помилка"]);
    return null;
  }
}


  function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  function getArrayOfDays() {
    const days = daysInMonth(today.getFullYear(), today.getMonth());
    return Array.from({ length: days }, (_, i) => ({
      id: i + 1,
      label: String(i + 1),
      content: `Вміст для дня ${i + 1}`,
    }));
  }

  const daysArr: DayTab[] = getArrayOfDays();

  useEffect(() => {
    async function fetchDay() {
      setLoading(true);
      const data = await getDayInfo(activeTab, today.getMonth() + 1, today.getFullYear());
      setDayData(data);
      setLoading(false);
    }
    fetchDay();
  }, [activeTab]);

  return (
    <div>
      <h1>Бухгалтерська панель</h1>
      <DaysTabBar tabs={daysArr} activeTab={activeTab} setActiveTab={setActiveTab} />

      {errors && <MessageBox messages={errors} type="error" />}

      {/* Вміст активної вкладки */}
        {loading ? (
          <p>Завантаження...</p>
        ) : dayData ? (
          <div>
            <p>Дата: {new Date(dayData.date).toLocaleDateString()}</p>
            <p>Кількість дітей: {dayData.countKids}</p>
            {/* Інші поля */}
          </div>
        ) : (
          daysArr.find(tab => tab.id === activeTab)?.content
        )}
    </div>
  );
};

export default DashboardPage;
