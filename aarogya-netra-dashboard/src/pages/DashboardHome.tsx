import {
  MessageSquare,
  Users,
  FolderOpen,
  BarChart3,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const DashboardHome = () => {

  // ✅ Added state
  const [statsData, setStatsData] = useState({
    total_feedback: 0,
    active_patients: 0,
    open_cases: 0,
    breaches: 0,
  });

  // ✅ Added API call
  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard-summary")
      .then((res) => res.json())
      .then((data) => setStatsData(data))
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, []);

  // 🔹 Only value field modified (design untouched)
  const stats = [
    { label: "Total Feedback", value: statsData.total_feedback, icon: MessageSquare, color: "text-info" },
    { label: "Active Patients", value: statsData.active_patients, icon: Users, color: "text-primary" },
    { label: "Open Cases", value: statsData.open_cases, icon: FolderOpen, color: "text-warning" },
    { label: "SLA Breaches", value: statsData.breaches, icon: Activity, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome to Aarogya Netra — your hospital feedback command center.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">Waiting for incoming data</p>
          </div>
        ))}
      </div>

      {/* WhatsApp Bot Card */}
      <div className="card-clinical overflow-hidden">
        <div className="h-1 bg-whatsapp" />
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-whatsapp/10">
              <MessageSquare className="h-6 w-6 text-whatsapp" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Your Hospital WhatsApp Bot</h3>
              <p className="mt-1 text-lg font-mono font-medium text-foreground">+14155238886</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Patients and guardians can send feedback directly to this number. All messages are automatically analyzed and routed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Patient Management", desc: "Register and manage patients", to: "/dashboard/patients", icon: Users },
          { label: "Feedback Stream", desc: "View real-time patient feedback", to: "/dashboard/feedback", icon: MessageSquare },
          { label: "Admin Analytics", desc: "Sentiment trends and department stats", to: "/dashboard/analytics", icon: BarChart3 },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="card-clinical p-5 group">
            <div className="flex items-center justify-between mb-2">
              <item.icon className="h-5 w-5 text-primary" />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold text-foreground">{item.label}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;