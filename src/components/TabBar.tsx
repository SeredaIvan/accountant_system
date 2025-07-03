
import { useEffect, useState } from "react";

interface DayTab{
  id:number
  label:string
  content:string
}
interface DaysTabBarProps {
  tabs: DayTab[];
  activeTab:number;
  setActiveTab:(id:number)=>void
}
export const DaysTabBar: React.FC<DaysTabBarProps> = ({ tabs ,activeTab,setActiveTab}) => {
  
  return (
    <div>
      <div style={{ display: "flex", borderBottom: "2px solid #ccc", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              border: "none",
              borderBottom: activeTab === tab.id ? "3px solid blue" : "3px solid transparent",
              backgroundColor: "transparent",
              fontWeight: activeTab === tab.id ? "bold" : "normal",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};