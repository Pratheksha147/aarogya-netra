import { useState, useEffect } from "react";
import { MessageSquare, AlertTriangle, FolderOpen, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"]; // Green, Yellow, Red

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin-analytics")
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error("Analytics fetch error:", err));
  }, []);

  if (!analytics) return <div className="p-6">Loading analytics...</div>;

  /* =========================
     SAFE NUMBER CONVERSION
  ========================== */

  const positive = Number(analytics.sentiment_distribution?.positive || 0);
  const neutral = Number(analytics.sentiment_distribution?.neutral || 0);
  const negative = Number(analytics.sentiment_distribution?.negative || 0);

  const pieData = [
    { name: "Positive", value: positive },
    { name: "Neutral", value: neutral },
    { name: "Negative", value: negative },
  ];

  const trendData =
    analytics.sentiment_trend?.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      positive: Number(item.positive),
      negative: Number(item.negative),
    })) || [];

  const dailyNegativeData =
    analytics.daily_negative?.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: Number(item.count),
    })) || [];

  const departmentData =
    analytics.departments?.map((item: any) => ({
      department: item.department,
      total: Number(item.total),
      resolved: Number(item.resolved),
    })) || [];

  const topCategories =
    analytics.top_categories?.map((item: any) => ({
      department: item.department,
      count: Number(item.count),
    })) || [];

  const stats = [
    {
      label: "Total Feedback",
      value: analytics.total_feedback,
      icon: MessageSquare,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Negative %",
      value: `${analytics.negative_percent}%`,
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      label: "Active Cases",
      value: analytics.active_cases,
      icon: FolderOpen,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      label: "SLA Breaches",
      value: analytics.breaches,
      icon: Clock,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-6">

      {/* =========================
          STATS CARDS
      ========================== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* =========================
          ROW 1
      ========================== */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Sentiment Distribution */}
        <div className="card-clinical p-6">
          <h3 className="mb-4 font-semibold text-foreground">
            Sentiment Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department-wise Issues */}
        <div className="card-clinical p-6">
          <h3 className="mb-4 font-semibold text-foreground">
            Department-wise Issues
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#3b82f6" />
              <Bar dataKey="resolved" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =========================
          ROW 2
      ========================== */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Sentiment Trend */}
        <div className="card-clinical p-6">
          <h3 className="mb-4 font-semibold text-foreground">
            Sentiment Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={3} />
              <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Negative */}
        <div className="card-clinical p-6">
          <h3 className="mb-4 font-semibold text-foreground">
            Daily Negative Feedback
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyNegativeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =========================
          TOP ISSUE CATEGORIES
      ========================== */}
      <div className="card-clinical p-6">
        <h3 className="mb-4 font-semibold text-foreground">
          Top Issue Categories
        </h3>

        {topCategories.length > 0 ? (
          <div className="space-y-3">
            {topCategories.map((item: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2"
              >
                <span className="font-medium">{item.department}</span>
                <span className="text-red-600 font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No issue categories available yet
          </p>
        )}
      </div>

    </div>
  );
};

export default AdminAnalytics;