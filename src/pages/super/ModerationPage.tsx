import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Shield, Check, X, Search, Filter, FileText, Image, Video, MessageCircle } from "lucide-react";

interface ModerationItem {
  id: number;
  type: "news" | "article" | "photo" | "video" | "comment";
  title: string;
  pondok: string;
  pondokId: number;
  reason: string;
  status: "pending" | "in-progress" | "approved" | "rejected" | "flagged";
  submittedDate: string;
  moderatedDate?: string;
  moderatorName?: string;
  priority: "low" | "medium" | "high";
  contentExcerpt?: string;
  fullContent?: string;
}

interface FilterState {
  search: string;
  type: string;
  status: string;
  priority: string;
  pondok: string;
}

export const ModerationPage = () => {
  const [rows, setRows] = useState<ModerationItem[]>([
    {
      id: 1,
      type: "news",
      title: "Prestasi Sanwati dalam Olimpiade Sains",
      pondok: "Darul Falah",
      pondokId: 101,
      reason: "Konten sensitif",
      status: "pending",
      submittedDate: "2025-10-15",
      priority: "high",
      contentExcerpt: "Sanwati kami berhasil meraih juara 1 dalam olimpiade sains tingkat nasional...",
      fullContent: "Sanwati Pondok Pesantren Darul Falah, Anisa Rahmawati (15 tahun), berhasil meraih juara 1 dalam Olimpiade Sains Nasional bidang Matematika yang diselenggarakan di Jakarta. Prestasi ini diraih setelah melalui seleksi bertahap dari tingkat kabupaten hingga nasional. Anisa berhasil mengungguli 500 peserta dari seluruh Indonesia dengan menyajikan solusi matematis inovatif untuk masalah optimasi lingkungan."
    },
    {
      id: 2,
      type: "photo",
      title: "Kegiatan Pramuka",
      pondok: "Al-Ikhlas",
      pondokId: 102,
      reason: "Hak cipta",
      status: "in-progress",
      submittedDate: "2025-10-14",
      moderatedDate: "2025-10-15",
      moderatorName: "Admin Ahmad",
      priority: "medium",
      contentExcerpt: "Foto dokumentasi kegiatan pramuka pondok...",
      fullContent: "Dokumentasi lengkap kegiatan Pramuka Pondok Al-Ikhlas yang berlangsung pada 12 Oktober 2025. Kegiatan diikuti oleh 150 santri dari tingkat SMP dan SMA. Foto-foto menampilkan berbagai kegiatan seperti upacara pembukaan, pelatihan baris-berbaris, kegiatan kemah, penerapan teknik bertahan hidup, dan penanaman pohon sebagai wujud kepedulian lingkungan. Kegiatan ini bertujuan untuk membentuk karakter disiplin dan jiwa kepemimpinan santri."
    },
    {
      id: 3,
      type: "article",
      title: "Manajemen Keuangan Pondok Modern",
      pondok: "Tahfidz Al-Qur'an",
      pondokId: 103,
      reason: "Konten tidak sesuai",
      status: "flagged",
      submittedDate: "2025-10-13",
      moderatedDate: "2025-10-14",
      moderatorName: "Admin Siti",
      priority: "high",
      contentExcerpt: "Pembahasan mengenai sistem manajemen keuangan yang transparan...",
      fullContent: "Artikel mendalam mengenai implementasi sistem manajemen keuangan berbasis digital di Pondok Pesantren Tahfidz Al-Qur'an. Artikel ini membahas langkah-langkah praktis dalam menciptakan transparansi keuangan, mulai dari penggunaan software akuntansi, pelaporan berkala kepada wali santri, audit internal, hingga penerapan standar akuntansi pesantren modern. Juga dibahas strategi pengelolaan dana wakaf dan program beasiswa yang bertanggung jawab."
    },
    {
      id: 4,
      type: "video",
      title: "Profil Pondok 2025",
      pondok: "Darul Falah",
      pondokId: 101,
      reason: "Kualitas rendah",
      status: "approved",
      submittedDate: "2025-10-12",
      moderatedDate: "2025-10-13",
      moderatorName: "Admin Budi",
      priority: "low",
      contentExcerpt: "Video profil singkat pondok dengan durasi 5 menit...",
      fullContent: "Video profil Pondok Darul Falah tahun 2025 yang menampilkan fasilitas lengkap, kegiatan akademik, program unggulan tahfidz, kegiatan ekstrakurikuler, dan testimoni para santri. Video berdurasi 5 menit ini juga menampilkan pencapaian-prestasi pondok, program pengembangan karakter, dan visi misi ke depan. Video diproduksi dengan kualitas HD dan dilengkapi subtitle bahasa Indonesia dan Inggris."
    },
    {
      id: 5,
      type: "comment",
      title: "Komentar pada berita prestasi",
      pondok: "Pondok Modern",
      pondokId: 104,
      reason: "Spam",
      status: "rejected",
      submittedDate: "2025-10-11",
      moderatedDate: "2025-10-12",
      moderatorName: "Admin Rina",
      priority: "low",
      contentExcerpt: "Komentar berisi link promosi yang tidak relevan...",
      fullContent: "Komentar yang diposting oleh pengguna anonim pada berita prestasi santri. Komentar ini mengandung link promosi produk jualan online yang tidak terkait dengan konten berita, termasuk link afiliasi ke e-commerce dan nomor WhatsApp untuk pemesanan. Komentar ini dianggap spam karena tidak relevan dan mengganggu diskusi yang berkualitas di platform pesantren digital."
    }
  ]);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    status: "all",
    priority: "all",
    pondok: ""
  });

  const updateStatus = (id: number, status: ModerationItem["status"]) => {
    setRows(prev => prev.map(r =>
      r.id === id ? {
        ...r,
        status,
        moderatedDate: new Date().toISOString().split('T')[0],
        moderatorName: "Super Admin"
      } : r
    ));
  };

  const accept = (id: number) => updateStatus(id, "approved");
  const reject = (id: number) => updateStatus(id, "rejected");
  const flag = (id: number) => updateStatus(id, "flagged");

  const getTypeIcon = (type: ModerationItem["type"]) => {
    switch (type) {
      case "news": return <FileText className="w-4 h-4 text-blue-500" />;
      case "article": return <FileText className="w-4 h-4 text-green-500" />;
      case "photo": return <Image className="w-4 h-4 text-purple-500" />;
      case "video": return <Video className="w-4 h-4 text-red-500" />;
      case "comment": return <MessageCircle className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: ModerationItem["type"]) => {
    switch (type) {
      case "news": return "Berita";
      case "article": return "Artikel";
      case "photo": return "Foto";
      case "video": return "Video";
      case "comment": return "Komentar";
      default: return type;
    }
  };

  const getStatusBadge = (status: ModerationItem["status"]) => {
    const statusConfig = {
      pending: { variant: "waiting" as const, label: "Menunggu" },
      "in-progress": { variant: "in-progress" as const, label: "Diproses" },
      approved: { variant: "verified" as const, label: "Disetujui" },
      rejected: { variant: "destructive" as const, label: "Ditolak" },
      flagged: { variant: "warning" as const, label: "Ditandai" }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: ModerationItem["priority"]) => {
    const priorityConfig = {
      low: { variant: "secondary" as const, label: "Rendah" },
      medium: { variant: "info" as const, label: "Sedang" },
      high: { variant: "destructive" as const, label: "Tinggi" }
    };

    const config = priorityConfig[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredRows = rows.filter(row => {
    if (filters.search && !row.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !row.pondok.toLowerCase().includes(filters.search.toLowerCase()) &&
        !row.reason.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.type !== "all" && row.type !== filters.type) return false;
    if (filters.status !== "all" && row.status !== filters.status) return false;
    if (filters.priority !== "all" && row.priority !== filters.priority) return false;
    if (filters.pondok && !row.pondok.toLowerCase().includes(filters.pondok.toLowerCase())) return false;
    return true;
  });

  const uniquePondoks = Array.from(new Set(rows.map(r => r.pondok)));
  const pendingCount = rows.filter(r => r.status === "pending").length;
  const flaggedCount = rows.filter(r => r.status === "flagged").length;
  const inProgressCount = rows.filter(r => r.status === "in-progress").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Moderasi Konten</h1>
        <p className="text-muted-foreground">Kelola moderasi konten dari semua pondok pesantren</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Menunggu Moderasi</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full hover:bg-orange-200 transition-colors duration-200">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Diproses</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-200">
                <Filter className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ditandai</p>
                <p className="text-2xl font-bold text-yellow-600">{flaggedCount}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full hover:bg-yellow-200 transition-colors duration-200">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" /> Filter Konten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Pencarian</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Cari judul, pondok, alasan..."
                    value={filters.search}
                    onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Jenis Konten</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={filters.type}
                  onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="all">Semua Jenis</option>
                  <option value="news">Berita</option>
                  <option value="article">Artikel</option>
                  <option value="photo">Foto</option>
                  <option value="video">Video</option>
                  <option value="comment">Komentar</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={filters.status}
                  onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="in-progress">Diproses</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                  <option value="flagged">Ditandai</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Prioritas</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={filters.priority}
                  onChange={e => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="all">Semua Prioritas</option>
                  <option value="high">Tinggi</option>
                  <option value="medium">Sedang</option>
                  <option value="low">Rendah</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Nama Pondok</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={filters.pondok}
                  onChange={e => setFilters(prev => ({ ...prev, pondok: e.target.value }))}
                >
                  <option value="">Semua Pondok</option>
                  {uniquePondoks.map(pondok => (
                    <option key={pondok} value={pondok}>{pondok}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Cards */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Daftar Moderasi ({filteredRows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRows.map(r => (
              <Card
                key={r.id}
                className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border border-gray-200 overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(r.type)}
                      <span className="text-sm font-medium text-gray-600">
                        {getTypeLabel(r.type)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        #{r.id}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {getPriorityBadge(r.priority)}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {r.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Meta Information */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Pondok:</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">{r.pondok}</div>
                        <div className="text-xs text-gray-500">ID: {r.pondokId}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Alasan:</span>
                      <span className="text-sm text-red-600 font-medium">{r.reason}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <div className="text-right">
                        {getStatusBadge(r.status)}
                        {r.moderatorName && r.status !== "pending" && (
                          <div className="text-xs text-gray-500 mt-1">
                            oleh {r.moderatorName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Tanggal:</span>
                      <div className="text-right text-sm">
                        <div>{r.submittedDate}</div>
                        {r.moderatedDate && (
                          <div className="text-xs text-gray-500">
                            Dimoderasi: {r.moderatedDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-2 pt-4 border-t">

                    {r.status === "pending" || r.status === "flagged" ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => accept(r.id)}
                          title="Setujui"
                          className="px-4 py-2 min-w-[80px] border-green-200 hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors duration-200"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Setujui
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reject(r.id)}
                          title="Tolak"
                          className="px-4 py-2 min-w-[80px] border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Tolak
                        </Button>
                        {r.status !== "flagged" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => flag(r.id)}
                            title="Tandai"
                            className="px-4 py-2 min-w-[80px] border-yellow-200 hover:bg-yellow-50 text-yellow-600 hover:text-yellow-700 transition-colors duration-200"
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            Tandai
                          </Button>
                        )}
                      </>
                    ) : r.status === "in-progress" ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => accept(r.id)}
                          title="Setujui"
                          className="px-4 py-2 min-w-[80px] border-green-200 hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors duration-200"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Setujui
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reject(r.id)}
                          title="Tolak"
                          className="px-4 py-2 min-w-[80px] border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Tolak
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(r.id, "pending")}
                        title="Buka Ulang"
                        className="px-4 py-2 min-w-[100px] border-blue-200 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                      >
                        <Shield className="w-4 h-4 mr-1" />
                        Buka Ulang
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredRows.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Tidak ada konten yang sesuai dengan filter yang dipilih.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


