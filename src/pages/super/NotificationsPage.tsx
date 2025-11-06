import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Trash2, CheckCircle2, Mail, Smartphone, MessageSquare, Globe, Calendar, BarChart3, Users, Eye, Clock, TrendingUp, AlertCircle, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { NotificationEnhanced, DeliveryChannel } from "@/types/notification";

// Enhanced sample data with analytics
const sampleNotifications: NotificationEnhanced[] = [
  {
    id: 1,
    title: "Maintenance Malam Ini",
    body: "Portal akan maintenance pukul 23:00-01:00. Mohon simpan pekerjaan Anda.",
    type: "warning",
    audience: "all",
    status: "sent",
    createdAt: "2025-10-03",
    sentAt: "2025-10-03T23:00:00Z",
    priority: "high",
    channels: ["web", "email", "push"],
    totalRecipients: 1250,
    deliveredCount: 1180,
    openCount: 890,
    clickCount: 120,
    openRate: 75.4,
    clickRate: 10.2,
    deliveryStatus: {
      web: { total: 1250, sent: 1250, delivered: 1180, failed: 0, pending: 0 },
      email: { total: 800, sent: 800, delivered: 760, failed: 25, pending: 15 },
      sms: { total: 0, sent: 0, delivered: 0, failed: 0, pending: 0 },
      push: { total: 450, sent: 450, delivered: 420, failed: 20, pending: 10 },
      whatsapp: { total: 0, sent: 0, delivered: 0, failed: 0, pending: 0 }
    },
    createdBy: "Super Admin",
    version: 1
  },
  {
    id: 2,
    title: "Update Fitur Verifikasi Pondok",
    body: "Sistem verifikasi pondok telah diperbarui dengan AI analysis dan workflow automation.",
    type: "info",
    audience: "pondok",
    status: "sent",
    createdAt: "2025-09-30",
    sentAt: "2025-09-30T10:00:00Z",
    priority: "medium",
    channels: ["web", "email"],
    totalRecipients: 45,
    deliveredCount: 44,
    openCount: 38,
    clickCount: 28,
    openRate: 86.4,
    clickRate: 63.6,
    deliveryStatus: {
      web: { total: 45, sent: 45, delivered: 44, failed: 1, pending: 0 },
      email: { total: 45, sent: 45, delivered: 44, failed: 1, pending: 0 },
      sms: { total: 0, sent: 0, delivered: 0, failed: 0, pending: 0 },
      push: { total: 0, sent: 0, delivered: 0, failed: 0, pending: 0 },
      whatsapp: { total: 0, sent: 0, delivered: 0, failed: 0, pending: 0 }
    },
    createdBy: "Super Admin",
    version: 1
  },
  {
    id: 3,
    title: "Webinar Manajemen Pondok Digital",
    body: "Bergabunglah dengan webinar eksklusif tentang transformasi digital pondok pesantren.",
    type: "announcement",
    audience: "users",
    status: "scheduled",
    createdAt: "2025-10-29",
    scheduledAt: "2025-11-05T14:00:00Z",
    priority: "medium",
    channels: ["web", "email", "push", "sms"],
    targetSegments: ["active_users", "pondok_admins"],
    imageUrl: "https://example.com/webinar-banner.jpg",
    actionUrl: "https://portal.pesantren.id/webinar",
    actionLabel: "Daftar Sekarang",
    createdBy: "Admin Marketing",
    version: 1
  }
];

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationEnhanced[]>(sampleNotifications);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<NotificationEnhanced["audience"]>("all");
  const [province, setProvince] = useState<string>("all");
  const [priority, setPriority] = useState<NotificationEnhanced["priority"]>("medium");
  const [selectedChannels, setSelectedChannels] = useState<DeliveryChannel[]>(["web", "email"]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);

  const sendNow = () => {
    if (!title.trim() || !body.trim()) return;

    const newNotification: NotificationEnhanced = {
      id: Math.max(0, ...notifications.map(n => n.id)) + 1,
      title,
      body: province === "all" ? body : `[${province}] ${body}`,
      type: "info",
      audience,
      status: "sent",
      createdAt: new Date().toISOString().slice(0,10),
      sentAt: new Date().toISOString(),
      priority,
      channels: selectedChannels,
      totalRecipients: audience === "all" ? 1250 : audience === "pondok" ? 45 : 850,
      deliveredCount: 0,
      openCount: 0,
      clickCount: 0,
      openRate: 0,
      clickRate: 0,
      deliveryStatus: {
        web: { total: 1250, sent: 1250, delivered: 0, failed: 0, pending: 1250 },
        email: { total: 800, sent: 800, delivered: 0, failed: 0, pending: 800 },
        sms: { total: 0, sent: 0, delivered: 0, failed: 0, pending: 0 },
        push: { total: 450, sent: 450, delivered: 0, failed: 0, pending: 450 },
        whatsapp: { total: 0, sent: 0, delivered: 0, failed: 0, pending: 0 }
      },
      createdBy: "Super Admin",
      version: 1
    };

    setNotifications([newNotification, ...notifications]);
    setTitle("");
    setBody("");
    setProvince("all");
    setSelectedChannels(["web", "email"]);
    setIsScheduled(false);
    setScheduledDate("");
  };

  const remove = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

  const getChannelIcon = (channel: DeliveryChannel) => {
    switch (channel) {
      case "web": return <Globe className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "sms": return <MessageSquare className="w-4 h-4" />;
      case "push": return <Smartphone className="w-4 h-4" />;
      case "whatsapp": return <MessageSquare className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: NotificationEnhanced["status"]) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft" },
      scheduled: { variant: "info" as const, label: "Terjadwal" },
      queued: { variant: "warning" as const, label: "Antrian" },
      sending: { variant: "info" as const, label: "Mengirim" },
      sent: { variant: "verified" as const, label: "Terkirim" },
      failed: { variant: "destructive" as const, label: "Gagal" },
      cancelled: { variant: "secondary" as const, label: "Dibatalkan" }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: NotificationEnhanced["priority"]) => {
    const colors = {
      low: "secondary",
      medium: "info",
      high: "destructive",
      urgent: "destructive"
    } as const;

    const labels = {
      low: "Rendah",
      medium: "Sedang",
      high: "Tinggi",
      urgent: "Urgent"
    };

    return (
      <Badge variant={colors[priority]}>
        {labels[priority]}
      </Badge>
    );
  };

  const getDeliveryRate = (notification: NotificationEnhanced) => {
    if (!notification.totalRecipients || !notification.deliveredCount) return "0";
    return ((notification.deliveredCount / notification.totalRecipients) * 100).toFixed(1);
  };

  // Calculate analytics
  const totalSent = notifications.filter(n => n.status === "sent").length;
  const totalScheduled = notifications.filter(n => n.status === "scheduled").length;
  const avgOpenRate = notifications
    .filter(n => n.openRate)
    .reduce((acc, n) => acc + (n.openRate || 0), 0) / notifications.filter(n => n.openRate).length || 0;
  const avgDeliveryRate = notifications
    .filter(n => n.totalRecipients)
    .reduce((acc, n) => acc + parseFloat(getDeliveryRate(n)), 0) / notifications.filter(n => n.totalRecipients).length || 0;

  // Table columns for notifications
  const tableColumns = [
    {
      key: 'title',
      label: 'Judul',
      render: (value: string, row: NotificationEnhanced) => (
        <div className="max-w-xs">
          <div className="font-medium text-sm line-clamp-1">{value}</div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{row.body}</div>
        </div>
      ),
      hideOnMobile: false
    },
    {
      key: 'audience',
      label: 'Audiens',
      render: (value: string) => {
        const audienceConfig = {
          all: { variant: "secondary" as const, label: "Semua", className: "bg-gray-100 text-gray-700" },
          pondok: { variant: "default" as const, label: "Pondok", className: "bg-blue-100 text-blue-700" },
          users: { variant: "outline" as const, label: "Pengguna", className: "bg-purple-100 text-purple-700 border-purple-200" }
        };
        const config = audienceConfig[value as keyof typeof audienceConfig] || audienceConfig.all;
        return (
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        );
      },
      hideOnMobile: true
    },
    {
      key: 'channels',
      label: 'Channel',
      render: (value: DeliveryChannel[]) => (
        <div className="flex gap-1">
          {value.map((channel, index) => (
            <div key={index} className="p-1 bg-gray-100 rounded" title={channel}>
              {getChannelIcon(channel)}
            </div>
          ))}
        </div>
      ),
      hideOnMobile: false
    },
    {
      key: 'priority',
      label: 'Prioritas',
      render: (value: string) => getPriorityBadge(value as NotificationEnhanced["priority"]),
      hideOnMobile: true
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => getStatusBadge(value as NotificationEnhanced["status"]),
      hideOnMobile: false
    },
    {
      key: 'performance',
      label: 'Performa',
      render: (value: any, row: NotificationEnhanced) => (
        row.status === "sent" ? (
          <div className="text-xs">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {row.openRate}% Open
            </div>
            {row.clickRate && (
              <div className="flex items-center gap-1 text-gray-500">
                <TrendingUp className="w-3 h-3" />
                {row.clickRate}% Click
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-500">-</span>
        )
      ),
      hideOnMobile: true
    },
    {
      key: 'createdAt',
      label: 'Tanggal',
      render: (value: string, row: NotificationEnhanced) => (
        <div className="text-xs">
          <div>{value}</div>
          {row.sentAt && <div className="text-gray-500">Kirim: {row.sentAt.split('T')[0]}</div>}
        </div>
      ),
      hideOnMobile: true
    }
  ];

  const renderActions = (row: NotificationEnhanced) => (
    <div className="flex justify-center gap-2 items-center">
      {row.status === "scheduled" ? (
        <Button size="sm" variant="outline" disabled title="Edit tidak tersedia untuk notifikasi terjadwal">
          <Edit className="w-4 h-4" />
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={() => {
          // Logic untuk edit notifikasi
          setTitle(row.title);
          setBody(row.body);
          setAudience(row.audience);
          setPriority(row.priority);
        }} title="Edit">
          <Edit className="w-4 h-4" />
        </Button>
      )}
      <Button size="sm" variant="danger" onClick={() => remove(row.id)} title="Hapus">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifikasi Multi-Channel</h1>
        <p className="text-muted-foreground">Kirim dan kelola notifikasi melalui berbagai channel dengan analytics lengkap</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Terkirim</p>
                <p className="text-2xl font-bold text-blue-600">{totalSent}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Terjadwal</p>
                <p className="text-2xl font-bold text-orange-600">{totalScheduled}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Open Rate</p>
                <p className="text-2xl font-bold text-green-600">{avgOpenRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Delivery Rate</p>
                <p className="text-2xl font-bold text-purple-600">{avgDeliveryRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3 bg-muted p-1 rounded-md mx-auto">
          <TabsTrigger
            value="create"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-4 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Buat Notifikasi
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-4 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Riwayat
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-4 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" /> Kirim Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Judul Notifikasi"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <Select value={audience} onValueChange={(value: NotificationEnhanced["audience"]) => setAudience(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Audiens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Pengguna</SelectItem>
                    <SelectItem value="pondok">Admin Pondok</SelectItem>
                    <SelectItem value="users">Pengguna biasa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={priority} onValueChange={(value: NotificationEnhanced["priority"]) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="Provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Provinsi</SelectItem>
                    <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
                    <SelectItem value="Jawa Timur">Jawa Timur</SelectItem>
                    <SelectItem value="Jawa Tengah">Jawa Tengah</SelectItem>
                    <SelectItem value="Banten">Banten</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="schedule"
                    checked={isScheduled}
                    onCheckedChange={setIsScheduled}
                  />
                  <Label htmlFor="schedule">Terjadwal</Label>
                </div>
              </div>

              {isScheduled && (
                <Input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                />
              )}

              <Textarea
                placeholder="Isi pesan notifikasi..."
                rows={4}
                value={body}
                onChange={e => setBody(e.target.value)}
              />

              {/* Channel Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Channel Pengiriman</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'web', label: 'Web Notif', icon: Globe },
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'push', label: 'Push Notif', icon: Smartphone },
                    { id: 'sms', label: 'SMS', icon: MessageSquare }
                  ].map((channel) => (
                    <div key={channel.id} className="flex items-center space-x-2">
                      <Switch
                        id={channel.id}
                        checked={selectedChannels.includes(channel.id as DeliveryChannel)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedChannels([...selectedChannels, channel.id as DeliveryChannel]);
                          } else {
                            setSelectedChannels(selectedChannels.filter(ch => ch !== channel.id));
                          }
                        }}
                      />
                      <Label htmlFor={channel.id} className="flex items-center gap-1 cursor-pointer">
                        <channel.icon className="w-4 h-4" />
                        <span className="text-sm">{channel.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="default">Save Draft</Button>
                <Button size="default" onClick={sendNow}>
                  <Send className="w-4 h-4 mr-2" />
                  {isScheduled ? "Jadwalkan" : "Kirim Sekarang"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Riwayat Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveTable
                data={notifications as any}
                columns={tableColumns}
                keyField="id"
                actions={renderActions}
                emptyMessage="Tidak ada notifikasi yang dikirim"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> Performa Channel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Web Notif", sent: 2500, delivered: 2350, rate: 94, icon: Globe, color: "blue" },
                    { name: "Email", sent: 1800, delivered: 1620, rate: 90, icon: Mail, color: "green" },
                    { name: "Push Notif", sent: 1200, delivered: 1080, rate: 90, icon: Smartphone, color: "purple" },
                    { name: "SMS", sent: 300, delivered: 285, rate: 95, icon: MessageSquare, color: "orange" }
                  ].map((channel) => {
                    const Icon = channel.icon;
                    const colorClasses = {
                      blue: "bg-blue-100 text-blue-600",
                      green: "bg-green-100 text-green-600",
                      purple: "bg-purple-100 text-purple-600",
                      orange: "bg-orange-100 text-orange-600"
                    };
                    return (
                      <div key={channel.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${colorClasses[channel.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{channel.name}</div>
                            <div className="text-xs text-gray-500">{channel.delivered}/{channel.sent} terkirim</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm">{channel.rate}%</div>
                          <div className="text-xs text-gray-500">delivery rate</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: "Open Rate", value: 75.4, trend: "up", change: "+5.2%" },
                    { metric: "Click Rate", value: 12.8, trend: "up", change: "+2.1%" },
                    { metric: "Conversion Rate", value: 3.2, trend: "down", change: "-0.5%" },
                    { metric: "Unsubscribe Rate", value: 0.8, trend: "down", change: "-0.2%" }
                  ].map((item) => (
                    <div key={item.metric} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{item.metric}</div>
                        <div className="text-xs text-gray-500">Last 30 days</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{item.value}%</div>
                        <div className={`text-xs flex items-center gap-1 ${
                          item.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          <TrendingUp className="w-3 h-3" />
                          {item.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};