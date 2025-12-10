import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#AA55FF"];

const InstructorChart = ({ courses }) => {
  const [view, setView] = useState("students"); // students | income

  // Prepare data for charts
  const studentData = courses.map((c) => ({
    name: c.courseName,
    value: c.studentsEnrolled?.length || 0,
  }));

  const incomeData = courses.map((c) => ({
    name: c.courseName,
    value: (c.studentsEnrolled?.length || 0) * c.price,
  }));

  const chartData = view === "students" ? studentData : incomeData;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
      <h3 className="text-xl font-semibold mb-3 text-white">
        {view === "students" ? "Students Distribution" : "Income Distribution"}
      </h3>

      {/* Toggle Buttons */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setView("students")}
          className={`px-4 py-2 rounded text-black ${
            view === "students" ? "bg-yellow-500" : "bg-gray-700"
          }`}
        >
          Students
        </button>

        <button
          onClick={() => setView("income")}
          className={`px-4 py-2 rounded text-black ${
            view === "income" ? "bg-yellow-500" : "bg-gray-700"
          }`}
        >
          Income
        </button>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 450 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend content={(legendProps) => <CustomLegend {...legendProps} />} />

          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CustomLegend = ({ payload }) => {
  return (
    <div className="max-h-28 overflow-y-auto text-sm flex flex-wrap gap-4 mt-2">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: entry.color,
            }}
          />
          <span className="text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};


export default InstructorChart;
