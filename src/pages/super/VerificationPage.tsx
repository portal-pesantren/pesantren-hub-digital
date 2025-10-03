import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileText, Search, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Submission {
  id: number;
  pondok: string;
  city: string;
  documents: number;
  status: "pending" | "review" | "verified" | "rejected";
  date: string;
}

export const VerificationPage = () => {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Submission[]>([
    { id: 101, pondok: "Darul Falah", city: "Bogor", documents: 6, status: "review", date: "2025-10-02" },
    { id: 102, pondok: "Al-Ikhlas", city: "Surabaya", documents: 5, status: "pending", date: "2025-10-01" },
    { id: 103, pondok: "Tahfidz Al-Qur'an", city: "Bandung", documents: 7, status: "pending", date: "2025-09-30" },
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
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Pondok</TableHead>
                      <TableHead>Kota</TableHead>
                      <TableHead>Dokumen</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>#{r.id}</TableCell>
                        <TableCell className="font-medium">{r.pondok}</TableCell>
                        <TableCell>{r.city}</TableCell>
                        <TableCell>{r.documents} file</TableCell>
                        <TableCell>
                          <Badge variant={r.status === "verified" ? "default" : r.status === "rejected" ? "outline" : "secondary"}>{r.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "verified")}>
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "rejected")}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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


