import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { School, Upload, Save, FileImage, Phone, Mail, Globe } from "lucide-react";

export const ProfilePage = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profile Pondok</h1>
          <p className="text-responsive-sm text-muted-foreground">Kelola informasi dan profil pondok pesantren Anda</p>
        </div>
        <Button className="bg-gradient-primary text-white shadow-elegant w-full sm:w-auto touch-target">
          <Save className="w-4 h-4 mr-2" />
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content - Forms */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Basic Information Card */}
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-responsive-lg">Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-responsive-sm">Nama Pondok</Label>
                <Input
                  id="name"
                  defaultValue="Pondok Pesantren Al-Hikmah"
                  className="h-10 sm:h-11 text-responsive-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="founded" className="text-responsive-sm">Tahun Berdiri</Label>
                  <Input
                    id="founded"
                    type="number"
                    defaultValue="1995"
                    className="h-10 sm:h-11 text-responsive-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-responsive-sm">Kategori</Label>
                  <Input
                    id="category"
                    defaultValue="Salafiyah Modern"
                    className="h-10 sm:h-11 text-responsive-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address" className="text-responsive-sm">Alamat Lengkap</Label>
                <Textarea
                  id="address"
                  rows={3}
                  defaultValue="Jl. Pendidikan No. 123, Kec. Pesantren, Kab. Islami, Jawa Timur 12345"
                  className="text-responsive-sm resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Vision & Mission Card */}
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-responsive-lg">Visi & Misi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vision" className="text-responsive-sm">Visi</Label>
                <Textarea
                  id="vision"
                  rows={3}
                  defaultValue="Menjadi pondok pesantren terdepan dalam mencetak generasi Qurani yang berakhlakul karimah"
                  className="text-responsive-sm resize-none"
                />
              </div>
              <div>
                <Label htmlFor="mission" className="text-responsive-sm">Misi</Label>
                <Textarea
                  id="mission"
                  rows={5}
                  defaultValue="1. Menyelenggarakan pendidikan Islam yang berkualitas&#10;2. Membentuk karakter santri yang islami&#10;3. Mengembangkan potensi akademik dan non-akademik"
                  className="text-responsive-sm resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Facilities Card */}
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-responsive-lg">Fasilitas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facilities" className="text-responsive-sm">Daftar Fasilitas</Label>
                <Textarea
                  id="facilities"
                  rows={6}
                  defaultValue="- Masjid besar berkapasitas 1000 jamaah&#10;- Asrama putra dan putri terpisah&#10;- Perpustakaan dengan koleksi 5000+ buku&#10;- Laboratorium komputer&#10;- Lapangan olahraga&#10;- Klinik kesehatan 24 jam"
                  className="text-responsive-sm resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card - Mobile View */}
          <Card className="shadow-card xl:hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-responsive-lg">Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone-mobile" className="text-responsive-sm">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telepon
                </Label>
                <Input
                  id="phone-mobile"
                  defaultValue="+62 812-3456-7890"
                  className="h-10 sm:h-11 text-responsive-sm"
                />
              </div>
              <div>
                <Label htmlFor="email-mobile" className="text-responsive-sm">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email-mobile"
                  type="email"
                  defaultValue="info@alhikmah.sch.id"
                  className="h-10 sm:h-11 text-responsive-sm"
                />
              </div>
              <div>
                <Label htmlFor="website-mobile" className="text-responsive-sm">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Website
                </Label>
                <Input
                  id="website-mobile"
                  defaultValue="www.alhikmah.sch.id"
                  className="h-10 sm:h-11 text-responsive-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Uploads & Contact */}
        <div className="space-y-4 sm:space-y-6">
          {/* Logo Upload Card */}
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-responsive-base flex items-center gap-2">
                <School className="w-5 h-5 text-primary" />
                Logo Pondok
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square rounded-lg bg-gradient-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center group hover:bg-gradient-primary/20 transition-colors">
                <div className="text-center p-4">
                  <School className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-2" />
                  <p className="text-responsive-sm text-muted-foreground">Logo Pondok</p>
                </div>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                />
                <Button
                  variant="outline"
                  className="w-full touch-target"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Format: JPG, PNG (Max 5MB)
              </div>
            </CardContent>
          </Card>

          {/* Cover Photo Upload Card */}
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-responsive-base flex items-center gap-2">
                <FileImage className="w-5 h-5 text-primary" />
                Foto Sampul
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video rounded-lg bg-gradient-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center group hover:bg-gradient-primary/20 transition-colors">
                <div className="text-center p-4">
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-2" />
                  <p className="text-responsive-sm text-muted-foreground">Upload Foto</p>
                </div>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="cover-upload"
                />
                <Button
                  variant="outline"
                  className="w-full touch-target"
                  onClick={() => document.getElementById('cover-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Foto Sampul
                </Button>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Format: JPG, PNG (Max 10MB)<br/>
                Recommended: 1920x1080px
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card - Desktop Only */}
          <Card className="shadow-card hidden xl:block">
            <CardHeader className="pb-4">
              <CardTitle className="text-responsive-base">Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-responsive-sm">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telepon
                </Label>
                <Input
                  id="phone"
                  defaultValue="+62 812-3456-7890"
                  className="h-10 sm:h-11 text-responsive-sm"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-responsive-sm">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="info@alhikmah.sch.id"
                  className="h-10 sm:h-11 text-responsive-sm"
                />
              </div>
              <div>
                <Label htmlFor="website" className="text-responsive-sm">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Website
                </Label>
                <Input
                  id="website"
                  defaultValue="www.alhikmah.sch.id"
                  className="h-10 sm:h-11 text-responsive-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card - Mobile Only */}
          <Card className="shadow-card xl:hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-responsive-base">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full touch-target">
                <FileImage className="w-4 h-4 mr-2" />
                Lihat Preview
              </Button>
              <Button variant="outline" className="w-full touch-target">
                <Save className="w-4 h-4 mr-2" />
                Simpan Draft
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
