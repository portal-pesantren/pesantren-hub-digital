import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileText, Search, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveTable } from "@/components/ui/responsive-table";

interface Submission {
  id: number;
  pondok: string;
  city: string;
  documents: number;
  status: "pending" | "waiting" | "in-progress" | "verified" | "suspended";
  date: string;
}

export const VerificationPage = () => {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Submission[]>([
    { id: 101, pondok: "Darul Falah", city: "Bogor", documents: 6, status: "in-progress", date: "2025-10-02" },
    { id: 102, pondok: "Al-Ikhlas", city: "Surabaya", documents: 5, status: "pending", date: "2025-10-01" },
    { id: 103, pondok: "Tahfidz Al-Qur'an", city: "Bandung", documents: 7, status: "waiting", date: "2025-09-30" },
  ]);

  const filtered = rows.filter(r => [r.pondok, r.city].some(v => v.toLowerCase().includes(search.toLowerCase())));
  const setStatus = (id: number, status: Submission["status"]) => setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  // Responsive table columns configuration
  const tableColumns = [
    {
      key: 'id',
      label: 'ID',
      render: (value: number) => (
        <Badge variant="outline" className="text-xs">
          #{value}
        </Badge>
      ),
      hideOnMobile: false
    },
    {
      key: 'pondok',
      label: 'Pondok',
      render: (value: string) => (
        <span className="font-medium text-sm">{value}</span>
      ),
      hideOnMobile: false
    },
    {
      key: 'city',
      label: 'Kota',
      render: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
      hideOnMobile: true
    },
    {
      key: 'documents',
      label: 'Dokumen',
      render: (value: number) => (
        <span className="text-sm">{value} file</span>
      ),
      hideOnMobile: false
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === "verified" ? "verified" :
          value === "in-progress" ? "in-progress" :
          value === "pending" ? "waiting" :
          value === "waiting" ? "waiting" :
          value === "suspended" ? "suspended" :
          "outline"
        }>
          {value === "in-progress" ? "In Progress" : value}
        </Badge>
      ),
      hideOnMobile: false
    },
    {
      key: 'date',
      label: 'Tanggal',
      render: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
      hideOnMobile: true
    }
  ];

  // Render actions for each row
  const renderActions = (row: Submission) => (
    <div className="flex justify-center gap-1">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setStatus(row.id, "verified")}
        title="Verifikasi"
        className="px-3 py-1 border-green-200 hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors duration-200"
      >
        <CheckCircle2 className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setStatus(row.id, "suspended")}
        title="Tolak"
        className="px-3 py-1 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200"
      >
        <XCircle className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Verifikasi Pondok</h1>
        <p className="text-muted-foreground">Review dan verifikasi pendaftaran pondok</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Cari pengajuan..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pondok">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pondok">Pondok</TabsTrigger>
          <TabsTrigger value="news">Berita</TabsTrigger>
        </TabsList>
        <TabsContent value="pondok" className="mt-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Pengajuan ({filtered.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveTable
                data={filtered}
                columns={tableColumns}
                keyField="id"
                actions={renderActions}
                emptyMessage="Tidak ada pengajuan yang tersedia"
                className="border rounded-lg overflow-hidden"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="news" className="mt-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary" /> Persetujuan Berita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[{ id: 901, title: "Prestasi Nasional", pondok: "Darul Falah" }, { id: 902, title: "Renovasi Asrama", pondok: "Al-Ikhlas" }].map(a => (
                  <div key={a.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <div className="font-medium text-foreground">{a.title}</div>
                      <div className="text-sm text-muted-foreground">{a.pondok}</div>
                    </div>
                    <div className="space-x-2">
                      <Button size="sm" variant="outline"><CheckCircle2 className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline"><XCircle className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};


