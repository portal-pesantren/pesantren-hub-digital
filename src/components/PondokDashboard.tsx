import { Users, GraduationCap, Calendar, TrendingUp, Eye, UserCheck } from "lucide-react";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const studentGrowthData = [
  { month: "Jan", total: 245 },
  { month: "Feb", total: 258 },
  { month: "Mar", total: 270 },
  { month: "Apr", total: 285 },
  { month: "Mei", total: 302 },
  { month: "Jun", total: 318 },
];

const engagementData = [
  { name: "Lihat Profil", value: 1234 },
  { name: "Klik Pendaftaran", value: 456 },
  { name: "Unduh Brosur", value: 289 },
  { name: "Kontak", value: 178 },
];

const recentActivities = [
  { title: "Kegiatan Tahfidz Pagi", date: "2025-10-01", category: "Rutin" },
  { title: "Wisuda Santri Angkatan 15", date: "2025-09-28", category: "Event" },
  { title: "Penerimaan Santri Baru 2025", date: "2025-09-15", category: "Pendaftaran" },
  { title: "Khataman Al-Quran Bersama", date: "2025-09-10", category: "Kegiatan" },
];

export const PondokDashboard = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-6 md:p-8 text-white shadow-elegant">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Assalamualaikum, Admin Pondok</h1>
        <p className="text-white/90 text-sm md:text-base">Kelola dan pantau aktivitas pondok Anda dengan mudah</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Santri"
          value={318}
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="Total Ustadz"
          value={24}
          icon={GraduationCap}
          trend={{ value: 2.1, isPositive: true }}
        />
        <StatCard
          title="Kegiatan Ini"
          value={12}
          icon={Calendar}
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title="Pengunjung"
          value="2.4K"
          icon={Eye}
          trend={{ value: 12.5, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg md:text-base">
              <TrendingUp className="w-5 h-5 text-primary" />
              Pertumbuhan Santri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={studentGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg md:text-base">
              <UserCheck className="w-5 h-5 text-primary" />
              <span className="hidden sm:inline">Engagement Orang Tua</span>
              <span className="sm:hidden">Engagement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            Lihat Semua
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 md:p-4 rounded-lg border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="font-medium text-foreground mb-1 truncate">{activity.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{activity.date}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full flex-shrink-0">
                  {activity.category}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
