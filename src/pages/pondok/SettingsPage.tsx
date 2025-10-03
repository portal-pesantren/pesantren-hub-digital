import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Database, 
  Users, 
  Mail,
  Key,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";

export const SettingsPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    weekly: true,
    monthly: false
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola konfigurasi dan preferensi pondok pesantren</p>
        </div>
        <Button className="bg-gradient-primary text-white shadow-elegant">
          <Save className="w-4 h-4 mr-2" />
          Simpan Perubahan
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Informasi Umum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pondok-name">Nama Pondok</Label>
                  <Input id="pondok-name" defaultValue="Pondok Pesantren Al-Hikmah" />
                </div>
                <div>
                  <Label htmlFor="timezone">Zona Waktu</Label>
                  <Select defaultValue="WIB">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih zona waktu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WIB">WIB (UTC+7)</SelectItem>
                      <SelectItem value="WITA">WITA (UTC+8)</SelectItem>
                      <SelectItem value="WIT">WIT (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Bahasa Default</Label>
                  <Select defaultValue="id">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bahasa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Mata Uang</Label>
                  <Select defaultValue="IDR">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mata uang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Tampilan Website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-title">Judul Website</Label>
                  <Input id="site-title" defaultValue="Portal Pondok Pesantren Al-Hikmah" />
                </div>
                <div>
                  <Label htmlFor="site-description">Deskripsi Website</Label>
                  <Textarea 
                    id="site-description" 
                    rows={3}
                    defaultValue="Portal resmi Pondok Pesantren Al-Hikmah - Mencetak generasi Qurani yang berakhlakul karimah"
                  />
                </div>
                <div>
                  <Label htmlFor="keywords">Keywords SEO</Label>
                  <Input 
                    id="keywords" 
                    placeholder="pondok pesantren, tahfidz, islamic boarding school"
                    defaultValue="pondok pesantren, tahfidz, islamic boarding school, al-hikmah"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Mode Maintenance</Label>
                    <p className="text-sm text-muted-foreground">
                      Sembunyikan website dari pengunjung
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Pengaturan Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Metode Notifikasi</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Terima notifikasi via email</p>
                      </div>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(value) => handleNotificationChange('email', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-accent" />
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Notifikasi browser</p>
                      </div>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(value) => handleNotificationChange('push', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Notifikasi via SMS</p>
                      </div>
                    </div>
                    <Switch 
                      id="sms-notifications"
                      checked={notifications.sms}
                      onCheckedChange={(value) => handleNotificationChange('sms', value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Jenis Notifikasi</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-report">Laporan Mingguan</Label>
                      <p className="text-sm text-muted-foreground">Statistik mingguan pondok</p>
                    </div>
                    <Switch 
                      id="weekly-report"
                      checked={notifications.weekly}
                      onCheckedChange={(value) => handleNotificationChange('weekly', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="monthly-report">Laporan Bulanan</Label>
                      <p className="text-sm text-muted-foreground">Statistik bulanan pondok</p>
                    </div>
                    <Switch 
                      id="monthly-report"
                      checked={notifications.monthly}
                      onCheckedChange={(value) => handleNotificationChange('monthly', value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Keamanan Akun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Password Saat Ini</Label>
                  <div className="relative">
                    <Input 
                      id="current-password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password saat ini"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-password">Password Baru</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    placeholder="Masukkan password baru"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    placeholder="Konfirmasi password baru"
                  />
                </div>
                <Button className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Ubah Password
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Sesi Aktif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Windows PC - Chrome</p>
                      <p className="text-sm text-muted-foreground">192.168.1.100 • Jakarta</p>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Aktif
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">iPhone - Safari</p>
                      <p className="text-sm text-muted-foreground">192.168.1.101 • Jakarta</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">2 jam lalu</Badge>
                      <Button size="sm" variant="outline" className="text-destructive">
                        Keluar
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Keluar dari Semua Sesi
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-accent" />
                Pengaturan Keamanan Lanjutan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Tambahan keamanan login</p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="login-alerts">Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notifikasi saat ada login baru</p>
                    </div>
                    <Switch id="login-alerts" defaultChecked />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-logout">Auto Logout</Label>
                      <p className="text-sm text-muted-foreground">Logout otomatis setelah tidak aktif</p>
                    </div>
                    <Switch id="auto-logout" defaultChecked />
                  </div>
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (menit)</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 menit</SelectItem>
                        <SelectItem value="30">30 menit</SelectItem>
                        <SelectItem value="60">1 jam</SelectItem>
                        <SelectItem value="120">2 jam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="website" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  SEO & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="google-analytics">Google Analytics ID</Label>
                  <Input 
                    id="google-analytics" 
                    placeholder="GA-XXXXXXXXX-X"
                    defaultValue="GA-123456789-1"
                  />
                </div>
                <div>
                  <Label htmlFor="google-search-console">Google Search Console</Label>
                  <Input 
                    id="google-search-console" 
                    placeholder="Verification code"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook-pixel">Facebook Pixel ID</Label>
                  <Input 
                    id="facebook-pixel" 
                    placeholder="123456789012345"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="search-indexing">Search Engine Indexing</Label>
                    <p className="text-sm text-muted-foreground">Izinkan mesin pencari mengindeks</p>
                  </div>
                  <Switch id="search-indexing" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Email Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input 
                    id="smtp-host" 
                    placeholder="smtp.gmail.com"
                    defaultValue="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input 
                    id="smtp-port" 
                    type="number"
                    placeholder="587"
                    defaultValue="587"
                  />
                </div>
                <div>
                  <Label htmlFor="email-username">Email Username</Label>
                  <Input 
                    id="email-username" 
                    placeholder="admin@alhikmah.sch.id"
                    defaultValue="admin@alhikmah.sch.id"
                  />
                </div>
                <div>
                  <Label htmlFor="email-password">Email Password</Label>
                  <Input 
                    id="email-password" 
                    type="password"
                    placeholder="Masukkan password email"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Backup & Restore
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Backup Data</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">Backup Terakhir</p>
                        <p className="text-sm text-muted-foreground">1 Oktober 2025, 14:30</p>
                      </div>
                      <Badge variant="default" className="bg-green-500">
                        Berhasil
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">Ukuran Backup</p>
                        <p className="text-sm text-muted-foreground">245.6 MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Database className="w-4 h-4 mr-2" />
                      Backup Sekarang
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Restore Data</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="backup-file">Upload File Backup</Label>
                      <Input 
                        id="backup-file" 
                        type="file" 
                        accept=".sql,.backup"
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-backup">Auto Backup Harian</Label>
                        <p className="text-sm text-muted-foreground">Backup otomatis setiap hari</p>
                      </div>
                      <Switch id="auto-backup" defaultChecked />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restore dari File
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Riwayat Backup</h4>
                <div className="space-y-2">
                  {[
                    { date: "1 Oktober 2025", size: "245.6 MB", status: "Berhasil" },
                    { date: "30 September 2025", size: "238.2 MB", status: "Berhasil" },
                    { date: "29 September 2025", size: "231.8 MB", status: "Berhasil" },
                    { date: "28 September 2025", size: "228.5 MB", status: "Gagal" }
                  ].map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{backup.date}</p>
                        <p className="text-sm text-muted-foreground">{backup.size}</p>
                      </div>
                      <Badge variant={backup.status === "Berhasil" ? "default" : "destructive"}>
                        {backup.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
