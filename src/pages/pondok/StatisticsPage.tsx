import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Eye, 
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { StatCard } from "@/components/StatCard";

// Sample data for charts
const studentGrowthData = [
  { year: "2019", total: 150, putra: 85, putri: 65 },
  { year: "2020", total: 180, putra: 102, putri: 78 },
  { year: "2021", total: 220, putra: 125, putri: 95 },
  { year: "2022", total: 280, putra: 158, putri: 122 },
  { year: "2023", total: 320, putra: 180, putri: 140 },
  { year: "2024", total: 380, putra: 215, putri: 165 }
];

const monthlyEngagementData = [
  { month: "Jan", visitors: 1200, pageViews: 3500, registrations: 45 },
  { month: "Feb", visitors: 1350, pageViews: 4200, registrations: 52 },
  { month: "Mar", visitors: 1500, pageViews: 4800, registrations: 68 },
  { month: "Apr", visitors: 1650, pageViews: 5200, registrations: 75 },
  { month: "May", visitors: 1800, pageViews: 5800, registrations: 82 },
  { month: "Jun", visitors: 1950, pageViews: 6200, registrations: 89 }
];

const classDistributionData = [
  { name: "Kelas 1 Tsanawiyah", value: 85, color: "hsl(160 84% 39%)" },
  { name: "Kelas 2 Tsanawiyah", value: 78, color: "hsl(160 70% 50%)" },
  { name: "Kelas 3 Tsanawiyah", value: 72, color: "hsl(160 60% 60%)" },
  { name: "Kelas 1 Aliyah", value: 68, color: "hsl(160 50% 70%)" },
  { name: "Kelas 2 Aliyah", value: 45, color: "hsl(160 40% 80%)" },
  { name: "Kelas 3 Aliyah", value: 32, color: "hsl(160 30% 90%)" }
];

const parentEngagementData = [
  { name: "Melihat Profil", value: 65, color: "hsl(160 84% 39%)" },
  { name: "Mengunduh Brosur", value: 45, color: "hsl(45 93% 47%)" },
  { name: "Mengisi Form Pendaftaran", value: 35, color: "hsl(120 60% 50%)" },
  { name: "Menghubungi Langsung", value: 25, color: "hsl(200 70% 50%)" },
  { name: "Tidak Ada Tindakan", value: 15, color: "hsl(0 60% 50%)" }
];

const COLORS = classDistributionData.map(item => item.color);

export const StatisticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Statistik & Analitik</h1>
          <p className="text-muted-foreground">Pantau performa dan perkembangan pondok pesantren</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="2024">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Santri Aktif"
          value={380}
          icon={Users}
          trend={{ value: 18.8, isPositive: true }}
        />
        <StatCard
          title="Pengunjung Bulan Ini"
          value="1.95K"
          icon={Eye}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Pendaftaran Baru"
          value={89}
          icon={TrendingUp}
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title="Tingkat Retensi"
          value="94.2%"
          icon={BarChart3}
          trend={{ value: 2.1, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Santri</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Pertumbuhan Santri Tahunan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={studentGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name="Total"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="putra" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      name="Putra"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="putri" 
                      stroke="hsl(160 60% 60%)" 
                      strokeWidth={2}
                      name="Putri"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Distribusi Kelas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={classDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {classDistributionData.map((entry, index) => (
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
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Detail Pertumbuhan Santri</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studentGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="putra" fill="hsl(var(--primary))" name="Santri Putra" />
                    <Bar dataKey="putri" fill="hsl(var(--accent))" name="Santri Putri" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Statistik Santri Aktif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Santri</p>
                      <p className="text-2xl font-bold text-primary">380</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent/5">
                    <div>
                      <p className="text-sm text-muted-foreground">Santri Putra</p>
                      <p className="text-2xl font-bold text-accent">215</p>
                    </div>
                    <Users className="w-8 h-8 text-accent" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/5">
                    <div>
                      <p className="text-sm text-muted-foreground">Santri Putri</p>
                      <p className="text-2xl font-bold text-green-600">165</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/5">
                    <div>
                      <p className="text-sm text-muted-foreground">Tingkat Kelulusan</p>
                      <p className="text-2xl font-bold text-blue-600">98.5%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Engagement Orang Tua
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={parentEngagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {parentEngagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                <CardTitle>Metrik Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parentEngagementData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{item.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="website" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Traffic Website Bulanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyEngagementData}>
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
                    <Bar dataKey="visitors" fill="hsl(var(--primary))" name="Pengunjung" />
                    <Bar dataKey="pageViews" fill="hsl(var(--accent))" name="Page Views" />
                    <Bar dataKey="registrations" fill="hsl(120 60% 50%)" name="Registrasi" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Website Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bounce Rate</span>
                      <span className="font-medium">42.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Session</span>
                      <span className="font-medium">3m 24s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pages/Session</span>
                      <span className="font-medium">2.8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Profil Pondok</span>
                      <span className="font-medium">1,234 views</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pendaftaran</span>
                      <span className="font-medium">856 views</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Galeri</span>
                      <span className="font-medium">642 views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Device Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mobile</span>
                      <span className="font-medium">68.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Desktop</span>
                      <span className="font-medium">28.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tablet</span>
                      <span className="font-medium">3.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
