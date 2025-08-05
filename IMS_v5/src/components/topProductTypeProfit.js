import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fetchQueryData } from "../api/fetchData";
import { decodeBase64 } from "../api/decodeBase64";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#8884d8"];

const TopProductTypeProfit = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartSize, setChartSize] = useState(100); // Default smaller chart

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No token found");
        }

        const categoriesData = await fetchQueryData(token, {
          table: "iposarv3.profit_per_category",
          columns: "*",
        });

        const sortedData = categoriesData
          .map((item) => ({
            CategoryName: decodeBase64(item.CategoryName),
            Profit: parseFloat(decodeBase64(item.Profit)),
          }))
          .sort((a, b) => b.Profit - a.Profit);

        const topCategories = sortedData.slice(0, 5);
        const othersProfit = sortedData.slice(5).reduce((sum, item) => sum + item.Profit, 0);

        const finalData = [...topCategories];
        if (othersProfit > 0) {
          finalData.push({ CategoryName: "Others", Profit: othersProfit });
        }

        setCategoryData(finalData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Adjust chart size dynamically
  useEffect(() => {
    const updateChartSize = () => {
      if (window.innerWidth < 400) {
        setChartSize(150); // Smallest chart for mobile screens
      } else if (window.innerWidth < 600) {
        setChartSize(150); // Medium chart for tablets
      } else {
        setChartSize(150); // Default for larger screens
      }
    };

    updateChartSize();
    window.addEventListener("resize", updateChartSize);

    return () => {
      window.removeEventListener("resize", updateChartSize);
    };
  }, []);

  return (
    <div className="flex justify-center">
      {loading ? (
        <p className="text-center">Loading data...</p>
      ) : categoryData.length === 0 ? (
        <p className="text-center">No data available</p>
      ) : (
        <ResponsiveContainer width="100%" minWidth={chartSize} height={chartSize + 30}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="Profit"
              nameKey="CategoryName"
              cx="50%"
              cy="50%"
              outerRadius={chartSize / 2.5}
              label={({ name }) => name} // Show category names
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopProductTypeProfit;
