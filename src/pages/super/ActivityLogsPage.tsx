import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileClock } from "lucide-react";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { STANDARD_TABLE_HEADERS } from "@/components/ui/table-header";

interface LogItem {
  id: number;
  pondok: string;
  admin: string;
  action: string;
  timestamp: string;
  category: "auth" | "content" | "settings" | "moderation";
}

export const ActivityLogsPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [rows] = useState<LogItem[]>([
    { id: 1, pondok: "Darul Falah", admin: "admin@darulfalah.id", action: "Login", timestamp: "2025-10-03 08:02", category: "auth" },
    { id: 2, pondok: "Al-Ikhlas", admin: "op@al-ikhlas.id", action: "Update berita", timestamp: "2025-10-03 09:10", category: "content" },
    { id: 3, pondok: "Tahfidz Al-Qur'an", admin: "it@tahfidz.id", action: "Ubah pengaturan", timestamp: "2025-10-02 14:20", category: "settings" },
  ]);
  const [range, setRange] = useState<string>("7d");

  const filtered = useMemo(() => rows.filter(r => {
    const matchSearch = [r.pondok, r.admin, r.action].some(v => v.toLowerCase().includes(search.toLowerCase()))
    const matchCategory = category === "all" || r.category === category;
    return matchSearch && matchCategory;
  }), [rows, search, category]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Log Aktivitas Admin</h1>
        <p className="text-muted-foreground">Pantau aktivitas admin pondok</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileClock className="w-5 h-5 text-primary" /> Log ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <Input placeholder="Cari pondok/admin/aksi..." value={search} onChange={e => setSearch(e.target.value)} />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Kategori" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="content">Konten</SelectItem>
                <SelectItem value="settings">Pengaturan</SelectItem>
                <SelectItem value="moderation">Moderasi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Rentang" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Hari</SelectItem>
                <SelectItem value="30d">30 Hari</SelectItem>
                <SelectItem value="90d">90 Hari</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ResponsiveTable
            headers={STANDARD_TABLE_HEADERS.ACTIVITY}
            data={filtered.map(r => ({
              time: r.timestamp,
              pondok: r.pondok,
              admin: r.admin,
              action: r.action,
              category: r.category
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
};


