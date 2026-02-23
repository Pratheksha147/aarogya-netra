import { useState } from "react";
import {
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  RefreshCw,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getFeedback } from "@/services/api";

const FeedbackStream = () => {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["feedback"],
    queryFn: getFeedback,
    refetchInterval: 5000,
  });

  const stats = [
    {
      label: "Total",
      value: data?.total ?? 0,
      icon: MessageSquare,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Positive",
      value: data?.positive ?? 0,
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      label: "Negative",
      value: data?.negative ?? 0,
      icon: TrendingDown,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      label: "Neutral",
      value: data?.neutral ?? 0,
      icon: Minus,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
  ];

  const filteredData = data?.data?.filter((item: any) => {
  const matchesSearch =
    item.message.toLowerCase().includes(search.toLowerCase());

  const matchesSource =
    sourceFilter === "all" ||
    item.source.toLowerCase() === sourceFilter;

  const matchesSentiment =
    sentimentFilter === "all" ||
    (sentimentFilter === "positive" && item.sentiment > 0) ||
    (sentimentFilter === "negative" && item.sentiment <= -0.3) ||
    (sentimentFilter === "neutral" &&
      item.sentiment > -0.3 &&
      item.sentiment <= 0);

  const matchesDept =
  deptFilter === "all" ||
  item.department?.toLowerCase().includes(deptFilter.toLowerCase());

  return (
    matchesSearch &&
    matchesSource &&
    matchesSentiment &&
    matchesDept
  );
});
if (isLoading) {
  return <div className="p-6">Loading feedback...</div>;
}

if (error) {
  return <div className="p-6 text-red-500">Failed to load feedback.</div>;
}
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Feedback Stream
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time patient feedback monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-primary text-primary"
          >
            <Activity className="h-4 w-4" /> Live
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-card flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">
                {stat.value}
              </p>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-clinical p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search feedback messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="all">All Sources</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </select>

          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="all">All Depts</option>
            <option value="opd">OPD</option>
            <option value="billing">Billing</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="nursing">Nursing</option>
            <option value="facilities">Facilities</option>
          </select>
        </div>
      </div>

      {/* Live Feed */}
      <div className="card-clinical p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Live Feed</h2>
        </div>

        {filteredData?.length > 0 ? (
          <div className="space-y-4">
            {filteredData?.map((item: any) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 bg-background shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">
                    {item.department}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.sentiment > 0
                        ? "bg-emerald-100 text-emerald-600"
                        : item.sentiment <= -0.3
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {item.sentiment > 0
                      ? "Positive"
                      : item.sentiment <= -0.3
                      ? "Negative"
                      : "Neutral"}
                  </span>
                </div>

                <p className="text-sm text-foreground mb-2">
                  {item.message}
                </p>

                <p className="text-xs text-muted-foreground">
                  Source: {item.source}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state py-16">
            <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-foreground">
              No feedback received yet
            </p>
            <p className="text-sm max-w-sm text-center text-muted-foreground">
              Incoming feedback will appear here in real-time
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackStream; 
