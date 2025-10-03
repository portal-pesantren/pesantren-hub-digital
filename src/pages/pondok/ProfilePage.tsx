import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { School, Upload, Save } from "lucide-react";

export const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Pondok</h1>
          <p className="text-muted-foreground">Kelola informasi dan profil pondok pesantren Anda</p>
        </div>
        <Button className="bg-gradient-primary text-white shadow-elegant">
          <Save className="w-4 h-4 mr-2" />
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Pondok</Label>
                <Input id="name" defaultValue="Pondok Pesantren Al-Hikmah" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="founded">Tahun Berdiri</Label>
                  <Input id="founded" type="number" defaultValue="1995" />
                </div>
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Input id="category" defaultValue="Salafiyah Modern" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea id="address" rows={3} defaultValue="Jl. Pendidikan No. 123, Kec. Pesantren, Kab. Islami, Jawa Timur 12345" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Visi & Misi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vision">Visi</Label>
                <Textarea id="vision" rows={3} defaultValue="Menjadi pondok pesantren terdepan dalam mencetak generasi Qurani yang berakhlakul karimah" />
              </div>
              <div>
                <Label htmlFor="mission">Misi</Label>
                <Textarea id="mission" rows={5} defaultValue="1. Menyelenggarakan pendidikan Islam yang berkualitas&#10;2. Membentuk karakter santri yang islami&#10;3. Mengembangkan potensi akademik dan non-akademik" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Fasilitas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facilities">Daftar Fasilitas</Label>
                <Textarea id="facilities" rows={6} defaultValue="- Masjid besar berkapasitas 1000 jamaah&#10;- Asrama putra dan putri terpisah&#10;- Perpustakaan dengan koleksi 5000+ buku&#10;- Laboratorium komputer&#10;- Lapangan olahraga&#10;- Klinik kesehatan 24 jam" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="w-5 h-5 text-primary" />
                Logo Pondok
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square rounded-lg bg-gradient-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
                <div className="text-center">
                  <School className="w-16 h-16 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Logo Pondok</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Foto Sampul</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video rounded-lg bg-gradient-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Upload Foto</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Foto Sampul
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" defaultValue="+62 812-3456-7890" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="info@alhikmah.sch.id" />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" defaultValue="www.alhikmah.sch.id" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
