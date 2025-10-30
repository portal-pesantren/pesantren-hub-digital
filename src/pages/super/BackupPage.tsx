import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, Download, Upload, RefreshCw } from "lucide-react";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { STANDARD_TABLE_HEADERS } from "@/components/ui/table-header";

interface BackupItem {
  id: number;
  createdAt: string;
  size: string;
  type: "full" | "incremental";
}

export const BackupPage = () => {
  const [items, setItems] = useState<BackupItem[]>([
    { id: 1, createdAt: "2025-10-01 02:00", size: "256 MB", type: "full" },
    { id: 2, createdAt: "2025-10-02 02:00", size: "34 MB", type: "incremental" },
  ]);

  const createBackup = () => {
    const id = Math.max(0, ...items.map(i => i.id)) + 1;
    setItems([{ id, createdAt: new Date().toLocaleString(), size: "40 MB", type: "incremental" }, ...items]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Backup & Restore</h1>
          <p className="text-muted-foreground">Kelola cadangan data portal</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={createBackup}><RefreshCw className="w-4 h-4 mr-2" /> Buat Backup</Button>
          <Button variant="outline"><Upload className="w-4 h-4 mr-2" /> Restore</Button>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5 text-primary" /> Riwayat Backup</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveTable
            headers={STANDARD_TABLE_HEADERS.BACKUP}
            data={items.map(i => ({
              id: `#${i.id}`,
              created: i.createdAt,
              size: i.size,
              type: i.type,
              actions: (
                <div className="flex justify-end">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
};


