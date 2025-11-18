import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileText } from "lucide-react";
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
  const [rows, setRows] = useState<Submission[]>([
    { id: 101, pondok: "Darul Falah", city: "Bogor", documents: 6, status: "in-progress", date: "2025-10-02" },
    { id: 102, pondok: "Al-Ikhlas", city: "Surabaya", documents: 5, status: "pending", date: "2025-10-01" },
    { id: 103, pondok: "Tahfidz Al-Qur'an", city: "Bandung", documents: 7, status: "waiting", date: "2025-09-30" },
  ]);

  const setStatus = (id: number, status: Submission["status"]) => setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Verifikasi Pondok</h1>
        <p className="text-muted-foreground">Review dan verifikasi pendaftaran pondok</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Pengajuan ({rows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveTable
            headers={STANDARD_TABLE_HEADERS.VERIFICATION}
            data={rows.map(r => ({
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
                    variant="verified"
                    onClick={() => setStatus(r.id, "verified")}
                    title="Verifikasi"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="suspended"
                    onClick={() => setStatus(r.id, "suspended")}
                    title="Tolak"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              )
            }))}
          />
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Daftar Pondok
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveTable
            headers={STANDARD_TABLE_HEADERS.PONDOK}
            data={[
              { id: 1, name: "Pondok Pesantren Darul Falah", city: "Bogor", province: "Jawa Barat", status: "verified", students: 520 },
              { id: 2, name: "Pesantren Modern Al-Ikhlas", city: "Surabaya", province: "Jawa Timur", status: "pending", students: 340 },
              { id: 3, name: "Pondok Tahfidz Al-Qur'an", city: "Bandung", province: "Jawa Barat", status: "verified", students: 280 },
              { id: 4, name: "Pondok Modern Al-Hikmah", city: "Jakarta", province: "DKI Jakarta", status: "verified", students: 150 },
              { id: 5, name: "Pondok Pesantren Nurul Iman", city: "Malang", province: "Jawa Timur", status: "verified", students: 450 }
            ].map(pondok => ({
              id: pondok.id,
              name: (
                <span className="font-medium text-sm">{pondok.name}</span>
              ),
              location: `${pondok.city}, ${pondok.province}`,
              students: pondok.students.toLocaleString(),
              status: (
                <Badge variant={pondok.status === "verified" ? "verified" : "waiting"}>
                  {pondok.status}
                </Badge>
              )
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
};