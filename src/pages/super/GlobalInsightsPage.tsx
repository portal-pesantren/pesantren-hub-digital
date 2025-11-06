import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { BarChart3, School, Users, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const regionData = [
  { region: "Jabar", pondok: 145 },
  { region: "Jatim", pondok: 132 },
  { region: "Jateng", pondok: 98 },
  { region: "Banten", pondok: 67 },
  { region: "Lainnya", pondok: 89 },
];

const growthData = [
  { month: "Jan", pondok: 12, users: 234 },
  { month: "Feb", pondok: 15, users: 289 },
  { month: "Mar", pondok: 18, users: 312 },
  { month: "Apr", pondok: 14, users: 298 },
  { month: "Mei", pondok: 20, users: 356 },
  { month: "Jun", pondok: 22, users: 401 },
];

const COLORS = ["hsl(var(--primary))", "hsl(216 70% 50%)", "hsl(216 60% 60%)", "hsl(216 50% 70%)", "hsl(var(--muted))"];

export const GlobalInsightsPage = () => {
  const [period, setPeriod] = useState("6m");
  const [segment, setSegment] = useState("all");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Insight Global</h1>
          <p className="text-muted-foreground">Analitik lintas pondok di seluruh portal</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={segment} onValueChange={setSegment}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Segment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="parents">Orang Tua</SelectItem>
              <SelectItem value="pondok">Pondok</SelectItem>
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Periode" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
              <SelectItem value="3m">3 Bulan</SelectItem>
              <SelectItem value="6m">6 Bulan</SelectItem>
              <SelectItem value="12m">12 Bulan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pondok" value={531} icon={School} trend={{ value: 8.2, isPositive: true }} />
        <StatCard title="Terverifikasi" value={498} icon={TrendingUp} trend={{ value: 3.5, isPositive: true }} />
        <StatCard title="Menunggu" value={33} icon={BarChart3} />
        <StatCard title="Total Pengguna" value={"12.5K"} icon={Users} trend={{ value: 15.3, isPositive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Distribusi Pondok per Wilayah</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={regionData} cx="50%" cy="50%" outerRadius={100} fill="hsl(var(--primary))" dataKey="pondok" nameKey="region">
                  {regionData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Pertumbuhan Pondok & Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="pondok" stroke="hsl(var(--primary))" strokeWidth={3} name="Pondok Baru" />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--accent))" strokeWidth={3} name="Pengguna Baru" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Registrasi Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="pondok" fill="hsl(var(--primary))" radius={[8,8,0,0]} name="Pondok Baru" />
              <Bar dataKey="users" fill="hsl(var(--accent))" radius={[8,8,0,0]} name="Pengguna Baru" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};


