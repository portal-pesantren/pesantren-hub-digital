import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings,
  Shield,
  Bell,
  Database,
  FileClock,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";

interface BackupItem {
  id: number;
  createdAt: string;
  size: string;
  type: "full" | "incremental";
}

interface LogItem {
  id: number;
  pondok: string;
  admin: string;
  action: string;
  timestamp: string;
  category: "auth" | "content" | "settings" | "moderation";
}

export const PortalSettingsPage = () => {
  // State for Backup & Restore
  const [backupItems, setBackupItems] = useState<BackupItem[]>([
    { id: 1, createdAt: "2025-10-01 02:00", size: "256 MB", type: "full" },
    { id: 2, createdAt: "2025-10-02 02:00", size: "34 MB", type: "incremental" },
  ]);

  // State for Activity Logs
  const [logSearch, setLogSearch] = useState("");
  const [logCategory, setLogCategory] = useState<string>("all");
  const [logRange, setLogRange] = useState<string>("7d");
  const [logItems] = useState<LogItem[]>([
    { id: 1, pondok: "Darul Falah", admin: "admin@darulfalah.id", action: "Login", timestamp: "2025-10-03 08:02", category: "auth" },
    { id: 2, pondok: "Al-Ikhlas", admin: "op@al-ikhlas.id", action: "Update berita", timestamp: "2025-10-03 09:10", category: "content" },
    { id: 3, pondok: "Tahfidz Al-Qur'an", admin: "it@tahfidz.id", action: "Ubah pengaturan", timestamp: "2025-10-02 14:20", category: "settings" },
    { id: 4, pondok: "Nurul Iman", admin: "admin@nuruliman.id", action: "Moderasi konten", timestamp: "2025-10-01 16:45", category: "moderation" },
    { id: 5, pondok: "Al-Hikmah", admin: "ustadz@alhikmah.id", action: "Logout", timestamp: "2025-09-30 18:30", category: "auth" },
  ]);

  // Functions
  const createBackup = () => {
    const id = Math.max(0, ...backupItems.map(i => i.id)) + 1;
    setBackupItems([{ id, createdAt: new Date().toLocaleString(), size: "40 MB", type: "incremental" }, ...backupItems]);
  };

  const filteredLogs = useMemo(() => logItems.filter(r => {
    const matchSearch = [r.pondok, r.admin, r.action].some(v => v.toLowerCase().includes(logSearch.toLowerCase()))
    const matchCategory = logCategory === "all" || r.category === logCategory;
    return matchSearch && matchCategory;
  }), [logItems, logSearch, logCategory]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pengaturan Portal</h1>
          <p className="text-muted-foreground">Konfigurasi global portal pesantren</p>
        </div>
        <Button className="bg-gradient-primary text-white">Simpan</Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-5 h-12 w-full">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-3 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Umum
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-3 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Notifikasi
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-3 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Keamanan
          </TabsTrigger>
          <TabsTrigger
            value="backup"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-3 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Backup
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-3 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Activity Logs
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Informasi Umum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nama Portal</Label>
                <Input defaultValue="Portal Pesantren Indonesia" />
              </div>
              <div>
                <Label>URL Portal</Label>
                <Input defaultValue="https://portal.pesantren.id" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email Support</Label>
                <Input defaultValue="support@pesantren.id" />
              </div>
              <div>
                <Label>Webhook URL</Label>
                <Input placeholder="https://hooks.zapier.com/..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Keamanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Policy Password</Label>
                  <Input placeholder="Min 8 karakter, 1 angka, 1 simbol" />
                </div>
                <div>
                  <Label>Rate Limit (req/menit)</Label>
                  <Input type="number" defaultValue={60} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Restore Tab */}
        <TabsContent value="backup">
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Backup & Restore
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={createBackup}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Buat Backup
                    </Button>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Dibuat</TableHead>
                        <TableHead>Ukuran</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backupItems.map(i => (
                        <TableRow key={i.id}>
                          <TableCell>#{i.id}</TableCell>
                          <TableCell>{i.createdAt}</TableCell>
                          <TableCell>{i.size}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              i.type === "full"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                              {i.type === "full" ? "Full" : "Incremental"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Logs Tab */}
        <TabsContent value="logs">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileClock className="w-5 h-5 text-primary" />
                Log Aktivitas ({filteredLogs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <Input
                  placeholder="Cari pondok/admin/aksi..."
                  value={logSearch}
                  onChange={e => setLogSearch(e.target.value)}
                  className="flex-1"
                />
                <Select value={logCategory} onValueChange={setLogCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="auth">Auth</SelectItem>
                    <SelectItem value="content">Konten</SelectItem>
                    <SelectItem value="settings">Pengaturan</SelectItem>
                    <SelectItem value="moderation">Moderasi</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={logRange} onValueChange={setLogRange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Rentang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 Hari</SelectItem>
                    <SelectItem value="30d">30 Hari</SelectItem>
                    <SelectItem value="90d">90 Hari</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Pondok</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Aksi</TableHead>
                      <TableHead>Kategori</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.timestamp}</TableCell>
                        <TableCell>{r.pondok}</TableCell>
                        <TableCell>{r.admin}</TableCell>
                        <TableCell>{r.action}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            r.category === "auth" ? "bg-blue-100 text-blue-800" :
                            r.category === "content" ? "bg-green-100 text-green-800" :
                            r.category === "settings" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {r.category}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};