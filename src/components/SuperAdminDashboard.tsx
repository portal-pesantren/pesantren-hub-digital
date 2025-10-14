import { School, CheckCircle, AlertTriangle, TrendingUp, Users, MapPin } from "lucide-react";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const pondokDistribution = [
  { name: "Jawa Barat", value: 145, color: "hsl(216 91% 35%)" },
  { name: "Jawa Timur", value: 132, color: "hsl(45 93% 55%)" },
  { name: "Jawa Tengah", value: 98, color: "hsl(106 65% 45%)" },
  { name: "Banten", value: 67, color: "hsl(17 65% 50%)" },
  { name: "Lainnya", value: 89, color: "hsl(177 65% 60%)" },
];

const monthlyRegistrations = [
  { month: "Jan", pondok: 12, users: 234 },
  { month: "Feb", pondok: 15, users: 289 },
  { month: "Mar", pondok: 18, users: 312 },
  { month: "Apr", pondok: 14, users: 298 },
  { month: "Mei", pondok: 20, users: 356 },
  { month: "Jun", pondok: 22, users: 401 },
  { month: "Jul", pondok: 19, users: 387 },
  { month: "Agu", pondok: 25, users: 423 },
  { month: "Sep", pondok: 21, users: 398 },
  { month: "Okt", pondok: 28, users: 456 },
];

const pendingPondok = [
  { name: "Pondok Pesantren Darul Falah", location: "Bogor, Jawa Barat", date: "2025-10-02", status: "Menunggu Verifikasi", statusType: "waiting" },
  { name: "Pesantren Modern Al-Ikhlas", location: "Surabaya, Jawa Timur", date: "2025-10-01", status: "Review Dokumen", statusType: "in-progress" },
  { name: "Pondok Tahfidz Al-Qur'an", location: "Bandung, Jawa Barat", date: "2025-09-30", status: "Menunggu Verifikasi", statusType: "waiting" },
  { name: "Pondok Modern Darussalam", location: "Jakarta Selatan, DKI Jakarta", date: "2025-09-29", status: "Suspend", statusType: "suspend" },
];

const COLORS = pondokDistribution.map(item => item.color);

export const SuperAdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-8 text-white shadow-elegant">
        <h1 className="text-3xl font-bold mb-2">Dashboard Super Admin</h1>
        <p className="text-white/90">Kelola dan pantau seluruh ekosistem Portal Pesantren Indonesia</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pondok Terdaftar"
          value={531}
          icon={School}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Pondok Terverifikasi"
          value={498}
          icon={CheckCircle}
          trend={{ value: 3.5, isPositive: true }}
        />
        <StatCard
          title="Menunggu Verifikasi"
          value={33}
          icon={AlertTriangle}
          trend={{ value: 2.1, isPositive: false }}
        />
        <StatCard
          title="Total Pengguna"
          value="12.5K"
          icon={Users}
          trend={{ value: 15.3, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Distribusi Pondok per Wilayah
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pondokDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {pondokDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Pendaftaran Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="pondok" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Pondok Baru" />
                <Bar dataKey="users" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} name="Pengguna Baru" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending Verifications */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pondok Menunggu Verifikasi</CardTitle>
          <Button variant="outline" size="sm">Lihat Semua</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingPondok.map((pondok, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{pondok.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {pondok.location}
                    </span>
                    <span>{pondok.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={pondok.statusType as any}>
                    {pondok.status}
                  </Badge>
                  <Button size="sm" variant="default">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
