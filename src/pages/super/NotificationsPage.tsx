import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Trash2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NotificationItem {
  id: number;
  title: string;
  body: string;
  date: string;
  audience: "all" | "pondok" | "users";
  status: "queued" | "sent";
}

export const NotificationsPage = () => {
  const [list, setList] = useState<NotificationItem[]>([
    { id: 1, title: "Maintenance Malam Ini", body: "Portal akan maintenance pukul 23:00-01:00.", date: "2025-10-03", audience: "all", status: "sent" },
    { id: 2, title: "Update Fitur", body: "Fitur verifikasi diperbarui.", date: "2025-09-30", audience: "pondok", status: "sent" },
  ]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<NotificationItem["audience"]>("all");

  const [province, setProvince] = useState<string>("all");

  const sendNow = () => {
    if (!title.trim() || !body.trim()) return;
    const item: NotificationItem = {
      id: Math.max(0, ...list.map(i => i.id)) + 1,
      title,
      body: province === "all" ? body : `[${province}] ${body}`,
      date: new Date().toISOString().slice(0,10),
      audience,
      status: "sent",
    };
    setList([item, ...list]);
    setTitle("");
    setBody("");
    setProvince("all");
  };

  const remove = (id: number) => setList(prev => prev.filter(i => i.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifikasi</h1>
        <p className="text-muted-foreground">Kirim dan kelola notifikasi portal</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Kirim Notifikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Judul" value={title} onChange={e => setTitle(e.target.value)} />
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger><SelectValue placeholder="Audiens" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="pondok">Pondok</SelectItem>
                <SelectItem value="users">Pengguna</SelectItem>
              </SelectContent>
            </Select>
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger><SelectValue placeholder="Provinsi" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Provinsi</SelectItem>
                <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
                <SelectItem value="Jawa Timur">Jawa Timur</SelectItem>
                <SelectItem value="Jawa Tengah">Jawa Tengah</SelectItem>
                <SelectItem value="Banten">Banten</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea placeholder="Isi pesan" rows={4} value={body} onChange={e => setBody(e.target.value)} />
          <div className="flex justify-end">
            <Button onClick={sendNow}>
              <Send className="w-4 h-4 mr-2" /> Kirim Sekarang
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Riwayat Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {list.map(n => (
              <div key={n.id} className="flex items-start justify-between p-4 rounded-lg border">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{n.title}</h4>
                    <Badge variant="secondary">{n.audience}</Badge>
                    <Badge variant={n.status === "sent" ? "default" : "secondary"} className="gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {n.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{n.body}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.date}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(n.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


