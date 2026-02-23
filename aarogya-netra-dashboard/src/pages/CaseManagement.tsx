import { useState } from "react";
import { FolderOpen, Search, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getCases } from "@/services/caseapi";

const CaseManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
 
  const { data, isLoading, error } = useQuery({
  queryKey: ["cases"],
  queryFn: getCases,
  refetchInterval: 5000,
});

  const statCards = [
  { label: "Total Cases", value: data?.total ?? 0, color: "text-foreground", bg: "" },
  { label: "Open", value: data?.open ?? 0, color: "text-red-600", bg: "" },
  { label: "In Progress", value: data?.in_progress ?? 0, color: "text-amber-600", bg: "" },
  { label: "Resolved", value: data?.resolved ?? 0, color: "text-emerald-600", bg: "" },
  { label: "SLA Breaches", value: data?.breached ?? 0, color: "text-white", bg: "bg-gradient-to-r from-red-500 to-orange-500" },
];

if (isLoading) {
  return <div className="p-6">Loading cases...</div>;
}

if (error) {
  return <div className="p-6 text-red-500">Failed to load cases.</div>;
}
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Case Management</h1>
          <p className="text-sm text-muted-foreground">Track and resolve patient feedback cases</p>
        </div>
        <Button variant="destructive" className="gap-2">
          <FileDown className="h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map((card) => (
          <div key={card.label} className={`card-clinical p-5 ${card.bg ? card.bg + " border-0" : ""}`}>
            <p className={`text-sm ${card.bg ? "text-white/80" : "text-muted-foreground"}`}>{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="card-clinical p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by case ID, issue, or patient..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Depts</option>
            <option value="opd">OPD</option>
            <option value="billing">Billing</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="nursing">Nursing</option>
            <option value="facilities">Facilities</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-clinical overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Case ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Department</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Issue</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">SLA Timer</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Priority</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
  {data?.data?.length > 0 ? (
    data.data.map((caseItem: any) => (
      <tr key={caseItem.id} className="border-t">
        <td className="px-4 py-3">{caseItem.id}</td>
        <td className="px-4 py-3">{caseItem.department}</td>
        <td className="px-4 py-3">Complaint Case</td>
        <td className="px-4 py-3">
          {caseItem.sla_deadline
            ? new Date(caseItem.sla_deadline).toLocaleString()
            : "N/A"}
        </td>
        <td className="px-4 py-3">Medium</td>
        <td className="px-4 py-3">
  <select
    value={caseItem.status}
    onChange={async (e) => {
      await fetch(`http://localhost:5000/api/cases/${caseItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: e.target.value }),
      });

      window.location.reload();
    }}
    className="border rounded px-2 py-1 text-sm"
  >
    <option value="Open">Open</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
  </select>
</td>
        <td className="px-4 py-3 text-right">
  {caseItem.status === "Resolved" ? (
    <span className="text-emerald-600 font-semibold">Resolved</span>
  ) : caseItem.is_breached === 1 ? (
    <span className="text-red-600 font-semibold">SLA Breached</span>
  ) : (
    <span className="text-green-600">Within SLA</span>
  )}
</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={7}>
        <div className="empty-state py-16">
          <FolderOpen className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-foreground">No cases found</p>
          <p className="text-sm max-w-sm text-center">
            Cases will be created automatically from negative feedback
          </p>
        </div>
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CaseManagement;

