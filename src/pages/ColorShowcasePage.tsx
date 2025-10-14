import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle, Info, XCircle, AlertTriangle } from "lucide-react";

const ColorShowcasePage = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Color System Showcase</h1>
        <p className="text-muted-foreground">
          Demonstrasi sistem warna baru dengan semantic colors dan header tabel
        </p>
      </div>

      {/* Semantic Colors Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Semantic Colors - Badges</CardTitle>
          <CardDescription>Badge dengan semantic colors baru</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Success
            </Badge>
            <Badge variant="info" className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              Info
            </Badge>
            <Badge variant="warning" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Warning
            </Badge>
            <Badge variant="danger" className="flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Danger
            </Badge>
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Semantic Colors Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Semantic Colors - Buttons</CardTitle>
          <CardDescription>Button dengan semantic colors baru</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="success" className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Success
            </Button>
            <Button variant="info" className="flex items-center gap-1">
              <Info className="w-4 h-4" />
              Info
            </Button>
            <Button variant="warning" className="flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Warning
            </Button>
            <Button variant="danger" className="flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              Danger
            </Button>
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table dengan Header Baru */}
      <Card>
        <CardHeader>
          <CardTitle>Tabel dengan Header Baru</CardTitle>
          <CardDescription>
            Header tabel menggunakan background #606F7D dengan font putih untuk kontras yang lebih baik
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tanggal Bergabung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Badge variant="success" className="flex items-center gap-1 w-fit">
                    <CheckCircle className="w-3 h-3" />
                    Aktif
                  </Badge>
                </TableCell>
                <TableCell>Ahmad Fauzi</TableCell>
                <TableCell>ahmad@example.com</TableCell>
                <TableCell>
                  <Badge variant="info">Admin</Badge>
                </TableCell>
                <TableCell>12 Jan 2024</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="warning" className="flex items-center gap-1 w-fit">
                    <AlertTriangle className="w-3 h-3" />
                    Pending
                  </Badge>
                </TableCell>
                <TableCell>Siti Nurhaliza</TableCell>
                <TableCell>siti@example.com</TableCell>
                <TableCell>
                  <Badge variant="secondary">User</Badge>
                </TableCell>
                <TableCell>15 Jan 2024</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Badge variant="danger" className="flex items-center gap-1 w-fit">
                    <XCircle className="w-3 h-3" />
                    Non-Aktif
                  </Badge>
                </TableCell>
                <TableCell>Budi Santoso</TableCell>
                <TableCell>budi@example.com</TableCell>
                <TableCell>
                  <Badge variant="outline">Guest</Badge>
                </TableCell>
                <TableCell>10 Jan 2024</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Color Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Referensi Warna</CardTitle>
          <CardDescription>Daftar warna yang telah ditambahkan ke sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Primary Color (Biru)</h4>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: '#042558' }}></div>
                <span className="text-sm">#042558 (HSL: 216 91% 18%)</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-success">Success Color (Hijau)</h4>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: '#2D821C' }}></div>
                <span className="text-sm">#2D821C (HSL: 106 65% 31%)</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-info">Info Color (Biru Muda)</h4>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: '#57DAD4' }}></div>
                <span className="text-sm">#57DAD4 (HSL: 177 65% 64%)</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-warning">Warning Color (Kuning)</h4>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: '#F9D74F' }}></div>
                <span className="text-sm">#F9D74F (HSL: 48 93% 65%)</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-danger">Danger Color (Merah)</h4>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: '#D95F2F' }}></div>
                <span className="text-sm">#D95F2F (HSL: 17 65% 51%)</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Table Header</h4>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: '#606F7D' }}></div>
                <span className="text-sm">#606F7D (HSL: 210 13% 36%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorShowcasePage;