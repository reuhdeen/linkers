import React, { useState, useEffect } from "react";
import { decodeBase64 } from "../api/decodeBase64";
import "../css/loading.css";
import "../css/tables.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

import { fetchQueryData } from "../api/fetchData";

const LineGraph = () => {
  const [dataReport, setDataReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState("daily");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No token found");
        }

        // Select the correct table based on the chosen duration
        const table =
          duration === "daily"
            ? "iposarv3.daily_revenue_summary"
            : duration === "weekly"
            ? "iposarv3.weekly_revenue_summary"
            : "iposarv3.monthly_revenue_summary";

        // Fetch data from API
        const reportsData = await fetchQueryData(token, {
          table: table,
          columns: "*",
        });

        setDataReport(reportsData);
      } catch (error) {
        console.error("Error fetching report data:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [duration]);

  // Process API data into recharts format
  const processData = () => {
    if (!dataReport || dataReport.length === 0) return [];

    return dataReport.map((item) => {
      if (duration === "daily") {
        return { date: decodeBase64(item.SaleDate), revenue: decodeBase64(item.TotalRevenue) };
      } else if (duration === "weekly") {
        return { date: `Week ${decodeBase64(item.WeekNumber)}, ${decodeBase64(item.Year)}`, revenue: decodeBase64(item.TotalRevenue) };
      } else if (duration === "monthly") {
        return { date: `Month ${decodeBase64(item.Month)}, ${decodeBase64(item.Year)}`, revenue: decodeBase64(item.TotalRevenue) };
      }
      return {};
    });
  };

  const chartData = processData();
  const maxRevenue = Math.max(...chartData.map((item) => Number(item.revenue))) || 10000;

  return (
    <div>
      {/* Toggle Buttons */}
      <div className="d-flex justify-content-center mb-3">
        <button
          className={`btn ${duration === "daily" ? "btn-primary" : "btn-outline-primary"} mx-1`}
          onClick={() => setDuration("daily")}
        >
          Daily
        </button>
        <button
          className={`btn ${duration === "weekly" ? "btn-primary" : "btn-outline-primary"} mx-1`}
          onClick={() => setDuration("weekly")}
        >
          Weekly
        </button>
        <button
          className={`btn ${duration === "monthly" ? "btn-primary" : "btn-outline-primary"} mx-1`}
          onClick={() => setDuration("monthly")}
        >
          Monthly
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading data...</p>
      ) : (
        
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            
            <YAxis domain={[0, maxRevenue + 1000]} />

            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LineGraph;
