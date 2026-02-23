import { useState, useEffect } from "react";
import { UserPlus, Search, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PatientManagement = () => {
  const { toast } = useToast();

  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    guardian_name: "",
    guardian_phone: "",
  });

  // ==========================
  // Fetch Patients
  // ==========================
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    fetch("http://localhost:5000/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error(err));
  };

  // ==========================
  // Add Patient
  // ==========================
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
        }),
      });

      if (!response.ok) throw new Error("Failed");

      toast({
        title: "Patient Added",
        description: "Patient registered successfully.",
      });

      setDialogOpen(false);

      setFormData({
        name: "",
        age: "",
        gender: "",
        phone: "",
        guardian_name: "",
        guardian_phone: "",
      });

      fetchPatients();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add patient",
        variant: "destructive",
      });
    }
  };

  // ==========================
  // Update Status
  // ==========================
  const updateStatus = async (id: number, status: string) => {
    await fetch(`http://localhost:5000/api/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchPatients();
  };

  // ==========================
  // Stats
  // ==========================
  const total = patients.length;
  const active = patients.filter((p) => p.status === "Active").length;
  const treatment = patients.filter(
    (p) => p.status === "Under Treatment"
  ).length;
  const discharged = patients.filter(
    (p) => p.status === "Discharged"
  ).length;

  const statCards = [
    { label: "Total Patients", value: total, color: "text-foreground" },
    { label: "Active", value: active, color: "text-emerald-600" },
    { label: "Under Treatment", value: treatment, color: "text-amber-600" },
    { label: "Discharged", value: discharged, color: "text-muted-foreground" },
  ];

  // ==========================
  // Filtering
  // ==========================
  const filteredPatients = patients.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search) ||
      p.guardian_name?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" || p.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Patient Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage patient records and guardian information
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" /> Add Patient
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input
                  placeholder="Full name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Age</Label>
                <Input
                  type="number"
                  placeholder="Age"
                  min={0}
                  required
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Guardian Name</Label>
                <Input
                  placeholder="Guardian full name"
                  value={formData.guardian_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      guardian_name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Guardian Phone</Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.guardian_phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      guardian_phone: e.target.value,
                    })
                  }
                />
              </div>

              <div className="sm:col-span-2 flex justify-end pt-2">
                <Button type="submit" className="gap-2">
                  <UserPlus className="h-4 w-4" /> Add Patient
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="card-clinical p-5">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="card-clinical p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients, phone, or guardian..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Under Treatment">
              Admitted - Under Treatment
            </option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-clinical overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="px-4 py-3 text-left font-medium">
                  Patient
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Phone
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Guardian
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state py-16">
                      <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
                      <p className="font-medium text-foreground">
                        No patients added yet
                      </p>
                      <p className="text-sm">
                        Click "Add Patient" to register the first patient
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.phone}</td>
                    <td className="px-4 py-3">{p.guardian_name}</td>
                    <td className="px-4 py-3">{p.status}</td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={p.status}
                        onChange={(e) =>
                          updateStatus(p.id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Under Treatment">
                          Admitted - Under Treatment
                        </option>
                        <option value="Discharged">Discharged</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;