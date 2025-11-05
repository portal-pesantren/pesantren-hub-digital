import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileText, Search, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { STANDARD_TABLE_HEADERS } from "@/components/ui/table-header";

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
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="pondok"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200"
          >
            Pondok
          </TabsTrigger>
          <TabsTrigger
            value="news"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200"
          >
            Berita
          </TabsTrigger>
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
                headers={STANDARD_TABLE_HEADERS.VERIFICATION}
                data={filtered.map(r => ({
                  id: (
                    <Badge variant="outline" className="text-xs">
                      #{r.id}
                    </Badge>
                  ),
                  pondok: (
                    <span className="font-medium text-sm">{r.pondok}</span>
                  ),
                  city: r.city,
                  documents: (
                    <span className="text-sm">{r.documents} file</span>
                  ),
                  status: (
                    <Badge variant={
                      r.status === "verified" ? "verified" :
                      r.status === "in-progress" ? "in-progress" :
                      r.status === "pending" ? "waiting" :
                      r.status === "waiting" ? "waiting" :
                      r.status === "suspended" ? "suspended" :
                      "outline"
                    }>
                      {r.status === "in-progress" ? "In Progress" : r.status}
                    </Badge>
                  ),
                  date: r.date,
                  actions: (
                    <div className="flex justify-center gap-2 items-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatus(r.id, "verified")}
                        title="Verifikasi"
                        className="px-3 py-2 border-green-200 hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors duration-200 flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatus(r.id, "suspended")}
                        title="Tolak"
                        className="px-3 py-2 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200 flex items-center justify-center"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                }))}
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
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="px-3 py-2 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" className="px-3 py-2 flex items-center justify-center"><XCircle className="w-4 h-4" /></Button>
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


