import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Eye, Check, X } from "lucide-react";

interface ReportItem {
  id: number;
  type: "news" | "media" | "comment";
  ref: string;
  reason: string;
  date: string;
}

export const ModerationPage = () => {
  const [rows, setRows] = useState<ReportItem[]>([
    { id: 1, type: "news", ref: "Artikel #42", reason: "Konten sensitif", date: "2025-09-28" },
    { id: 2, type: "media", ref: "Foto #12", reason: "Hak cipta", date: "2025-09-30" },
  ]);

  const accept = (id: number) => setRows(prev => prev.filter(r => r.id !== id));
  const reject = (id: number) => setRows(prev => prev.filter(r => r.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Moderasi</h1>
        <p className="text-muted-foreground">Tinjau laporan dan ambil tindakan</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Laporan ({rows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Referensi</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Alasan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>#{r.id}</TableCell>
                    <TableCell className="font-medium">{r.ref}</TableCell>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>{r.reason}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => accept(r.id)}><Check className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => reject(r.id)}><X className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


