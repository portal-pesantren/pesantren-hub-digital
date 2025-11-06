import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings, Shield, Bell } from "lucide-react";

export const PortalSettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Konfigurasi Portal</h1>
          <p className="text-muted-foreground">Pengaturan global portal pesantren</p>
        </div>
        <Button className="bg-gradient-primary text-white">Simpan</Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted p-1 rounded-md mx-auto">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-4 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Umum
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-4 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Keamanan
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-4 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Notifikasi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> Informasi Umum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nama Portal</Label>
                <Input defaultValue="Portal Pesantren Indonesia" />
              </div>
              <div>
                <Label>URL Portal</Label>
                <Input defaultValue="https://portal.pesantren.id" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Keamanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Policy Password</Label>
                  <Input placeholder="Min 8 karakter, 1 angka, 1 simbol" />
                </div>
                <div>
                  <Label>Rate Limit (req/menit)</Label>
                  <Input type="number" defaultValue={60} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Notifikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email Support</Label>
                <Input defaultValue="support@pesantren.id" />
              </div>
              <div>
                <Label>Webhook URL</Label>
                <Input placeholder="https://hooks.zapier.com/..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};


