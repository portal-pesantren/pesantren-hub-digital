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
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-4 sm:p-6 md:p-8 text-white shadow-elegant">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Dashboard Super Admin</h1>
        <p className="text-white/90 text-xs sm:text-sm md:text-base">Kelola dan pantau seluruh ekosistem Portal Pesantren Indonesia</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="hidden xs:inline">Distribusi Pondok</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={200} minWidth={300}>
                <PieChart>
                  <Pie
                    data={pondokDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => {
                      const shortName = name.length > 8 ? name.substring(0, 6) + "..." : name;
                      return `${shortName}: ${(percent * 100).toFixed(0)}%`;
                    }}
                    outerRadius={60}
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
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="hidden xs:inline">Pendaftaran Bulanan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={200} minWidth={300}>
                <BarChart data={monthlyRegistrations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '10px' }}
                    iconSize={10}
                  />
                  <Bar dataKey="pondok" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Pondok" />
                  <Bar dataKey="users" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Pengguna" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Verifications - Responsive Table */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Pondok Menunggu Verifikasi</CardTitle>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            Lihat Semua
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile View - Card Layout */}
          <div className="sm:hidden p-4 space-y-3">
            {pendingPondok.map((pondok, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm leading-tight line-clamp-2">{pondok.name}</h4>
                  <Badge variant={pondok.statusType as any} className="text-xs flex-shrink-0">
                    {pondok.status === "in-progress" ? "In Progress" : pondok.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{pondok.location}</span>
                  </div>
                  <div>{pondok.date}</div>
                </div>
                <Button size="sm" variant="default" className="w-full">
                  Review
                </Button>
              </div>
            ))}
          </div>

          {/* Tablet & Desktop View - Table Layout */}
          <div className="hidden sm:block p-4 sm:p-6">
            <div className="rounded-lg border overflow-x-auto">
              <div className="min-w-[800px]">
                <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="h-12 px-4 text-left align-middle font-semibold bg-table-header text-table-header-foreground text-sm title-case">
                          Nama Pondok
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-semibold bg-table-header text-table-header-foreground text-sm title-case hidden lg:table-cell">
                          Lokasi
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-semibold bg-table-header text-table-header-foreground text-sm title-case hidden md:table-cell">
                          Tanggal
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-semibold bg-table-header text-table-header-foreground text-sm title-case">
                          Status
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-semibold bg-table-header text-table-header-foreground text-sm title-case">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-t">
                      {pendingPondok.map((pondok, index) => (
                        <tr key={index} className="hover:bg-muted/25 transition-colors">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-foreground max-w-xs lg:max-w-md">
                              <div className="truncate">{pondok.name}</div>
                              <div className="text-xs text-muted-foreground lg:hidden mt-1">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate">{pondok.location}</span>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground md:hidden lg:hidden mt-1">
                                {pondok.date}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="text-sm text-muted-foreground max-w-xs truncate">
                              {pondok.location}
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="text-sm text-muted-foreground">
                              {pondok.date}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={pondok.statusType as any} className="text-xs">
                              {pondok.status === "in-progress" ? "In Progress" : pondok.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button size="sm" variant="default" className="flex-shrink-0">
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
