import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Shield, Check, X, Search, Filter, FileText, Image, Video, MessageCircle, RefreshCw, ChevronUp, ChevronDown, CheckSquare, Square } from "lucide-react";

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

interface SortState {
  field: string;
  direction: 'asc' | 'desc';
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

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const [sort, setSort] = useState<SortState>({
    field: "submittedDate",
    direction: "desc"
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showBatchActions, setShowBatchActions] = useState(false);

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

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortData = (data: ModerationItem[]) => {
    return [...data].sort((a, b) => {
      let aValue: any = a[sort.field as keyof ModerationItem];
      let bValue: any = b[sort.field as keyof ModerationItem];

      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

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
      pending: {
        variant: "waiting" as const,
        label: "Menunggu"
      },
      "in-progress": {
        variant: "in-progress" as const,
        label: "Diproses"
      },
      approved: {
        variant: "verified" as const,
        label: "Disetujui"
      },
      rejected: {
        variant: "destructive" as const,
        label: "Ditolak"
      },
      flagged: {
        variant: "warning" as const,
        label: "Ditandai"
      }
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

  const filteredAndSortedRows = rows.filter(row => {
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

  const sortedRows = sortData(filteredAndSortedRows);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedRows.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedRows.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      setShowBatchActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const toggleAllSelection = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
      setShowBatchActions(false);
    } else {
      const allIds = currentItems.map(item => item.id);
      setSelectedItems(allIds);
      setShowBatchActions(true);
    }
  };

  const batchApprove = () => {
    selectedItems.forEach(id => updateStatus(id, "approved"));
    setSelectedItems([]);
    setShowBatchActions(false);
  };

  const batchReject = () => {
    selectedItems.forEach(id => updateStatus(id, "rejected"));
    setSelectedItems([]);
    setShowBatchActions(false);
  };

  const batchFlag = () => {
    selectedItems.forEach(id => updateStatus(id, "flagged"));
    setSelectedItems([]);
    setShowBatchActions(false);
  };

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
                    onChange={e => updateFilters({ search: e.target.value })}
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
                  onChange={e => updateFilters({ type: e.target.value })}
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
                  onChange={e => updateFilters({ status: e.target.value })}
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
                  onChange={e => updateFilters({ priority: e.target.value })}
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
                  onChange={e => updateFilters({ pondok: e.target.value })}
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

      {/* Batch Actions Bar */}
      {showBatchActions && (
        <Card className="shadow-card mb-4 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedItems.length} item dipilih
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={batchApprove}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Setujui Semua
                </Button>
                <Button
                  size="sm"
                  onClick={batchReject}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <X className="w-4 h-4 mr-1" />
                  Tolak Semua
                </Button>
                <Button
                  size="sm"
                  onClick={batchFlag}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Tandai Semua
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedItems([]);
                    setShowBatchActions(false);
                  }}
                >
                  Batal Pilih
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Moderation Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Daftar Moderasi ({filteredAndSortedRows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="w-12">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleAllSelection}
                      className="h-auto p-1 hover:bg-transparent"
                    >
                      {selectedItems.length === currentItems.length && currentItems.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('id')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      ID
                      {sort.field === 'id' && (
                        sort.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('type')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Jenis
                      {sort.field === 'type' && (
                        sort.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('pondok')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Nama Pondok
                      {sort.field === 'pondok' && (
                        sort.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">Alasan Moderasi</TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('status')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Status
                      {sort.field === 'status' && (
                        sort.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('priority')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Tingkat Risiko
                      {sort.field === 'priority' && (
                        sort.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('submittedDate')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Tanggal Diajukan
                      {sort.field === 'submittedDate' && (
                        sort.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((r: ModerationItem) => (
                  <TableRow
                    key={r.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${selectedItems.includes(r.id) ? 'bg-blue-50' : ''}`}
                  >
                    <TableCell className="w-12">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleItemSelection(r.id)}
                        className="h-auto p-1 hover:bg-transparent"
                      >
                        {selectedItems.includes(r.id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="outline" className="text-xs">
                        #{r.id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(r.type)}
                        <span className="text-sm font-medium">{getTypeLabel(r.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{r.pondok}</div>
                        <div className="text-xs text-gray-500">ID: {r.pondokId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-red-600 font-medium">{r.reason}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(r.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(r.priority)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{r.submittedDate}</div>
                        {r.moderatedDate && (
                          <div className="text-xs text-gray-500">
                            Mod: {r.moderatedDate}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        {r.status === "pending" || r.status === "flagged" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => accept(r.id)}
                              title="Setujui"
                              className="px-3 py-1 border-green-200 hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors duration-200"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => reject(r.id)}
                              title="Tolak"
                              className="px-3 py-1 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            {r.status !== "flagged" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => flag(r.id)}
                                title="Tandai"
                                className="px-3 py-1 border-yellow-200 hover:bg-yellow-50 text-yellow-600 hover:text-yellow-700 transition-colors duration-200"
                              >
                                <Shield className="w-4 h-4" />
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
                              className="px-3 py-1 border-green-200 hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors duration-200"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => reject(r.id)}
                              title="Tolak"
                              className="px-3 py-1 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(r.id, "pending")}
                            title="Buka Ulang"
                            className="px-3 py-1 border-blue-200 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {currentItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Tidak ada konten yang sesuai dengan filter yang dipilih.</p>
            </div>
          ) : (
            totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Menampilkan {indexOfFirstItem + 1} hingga {Math.min(indexOfLastItem, sortedRows.length)} dari {sortedRows.length} data
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-gray-300"
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(index + 1)}
                      className={currentPage === index + 1 ? "bg-primary" : "border-gray-300"}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-gray-300"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};


