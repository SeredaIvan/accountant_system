"use client";
import { DaysTabBar } from "@/components/TabBar";
import { useEffect, useState } from "react";
interface DayTab{
  id:number
  label:string
  content:string
}
const DashboardPage = () => {
  
  const today = new Date();
  const [activeTab, setActiveTab] = useState<number>(today.getDate());

  function getDayInfo(day : number){
    
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

  const daysArr:DayTab[] = getArrayOfDays();
  const monnthName = today.toLocaleDateString("uk-Ua",{month:"long"})
  
  useEffect(()=>{console.log(activeTab)}, [activeTab])

  return (
    <div>
      <h1>Бухгалтерська панель</h1>
      <DaysTabBar 
        tabs={daysArr}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Вміст активної вкладки */}
      <div style={{ padding: "20px", border: "1px solid #ccc" }}>
        {daysArr.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default DashboardPage;
