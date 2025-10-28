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
  { name: "Pondok Pesantren Darul Falah", location: "Bogor, Jawa Barat", date: "2025-10-02", status: "waiting", statusType: "waiting" },
  { name: "Pesantren Modern Al-Ikhlas", location: "Surabaya, Jawa Timur", date: "2025-10-01", status: "in-progress", statusType: "in-progress" },
  { name: "Pondok Tahfidz Al-Qur'an", location: "Bandung, Jawa Barat", date: "2025-09-30", status: "pending", statusType: "waiting" },
  { name: "Pondok Modern Darussalam", location: "Jakarta Selatan, DKI Jakarta", date: "2025-09-29", status: "suspended", statusType: "suspended" },
];

const COLORS = pondokDistribution.map(item => item.color);

export const SuperAdminDashboard = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-6 md:p-8 text-white shadow-elegant">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard Super Admin</h1>
        <p className="text-white/90 text-sm md:text-base">Kelola dan pantau seluruh ekosistem Portal Pesantren Indonesia</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Pondok"
          value={531}
          icon={School}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Terverifikasi"
          value={498}
          icon={CheckCircle}
          trend={{ value: 3.5, isPositive: true }}
        />
        <StatCard
          title="Menunggu"
          value={33}
          icon={AlertTriangle}
          trend={{ value: 2.1, isPositive: false }}
        />
        <StatCard
          title="Pengguna"
          value="12.5K"
          icon={Users}
          trend={{ value: 15.3, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg md:text-base">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="hidden sm:inline">Distribusi Pondok per Wilayah</span>
              <span className="sm:hidden">Distribusi Wilayah</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pondokDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    const shortName = name.length > 8 ? name.substring(0, 6) + "..." : name;
                    return window.innerWidth < 640 ? `${shortName}: ${(percent * 100).toFixed(0)}%` : `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
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
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg md:text-base">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="hidden sm:inline">Pendaftaran Bulanan</span>
              <span className="sm:hidden">Pendaftaran</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  iconSize={12}
                />
                <Bar dataKey="pondok" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Pondok" />
                <Bar dataKey="users" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Pengguna" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending Verifications */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg">Pondok Menunggu Verifikasi</CardTitle>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            Lihat Semua
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-3">
            {pendingPondok.map((pondok, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 rounded-lg border hover:bg-secondary/50 transition-colors gap-3"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground mb-1 truncate">{pondok.name}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{pondok.location}</span>
                    </span>
                    <span>{pondok.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-shrink-0">
                  <Badge variant={pondok.statusType as any} className="text-xs">
                    {pondok.status === "in-progress" ? "In Progress" : pondok.status}
                  </Badge>
                  <Button size="sm" variant="default" className="flex-shrink-0">
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
