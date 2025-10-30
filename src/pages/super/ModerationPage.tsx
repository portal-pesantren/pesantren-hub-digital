import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { ContentPreviewModal } from "@/components/moderation/ContentPreviewModal";
import { Shield, Check, X, Search, Filter, FileText, Image, Video, MessageCircle, RefreshCw, Eye, Brain } from "lucide-react";
import { ModerationItemEnhanced, AIContentAnalysis } from "@/types/moderation";

// Enhanced data with AI analysis simulation
const sampleAIAnalysis: AIContentAnalysis[] = [
  {
    id: 1,
    itemId: 1,
    timestamp: "2025-10-30T07:36:00Z",
    safetyScore: 85,
    categories: {
      spam: 10,
      violence: 5,
      adult: 0,
      hate: 0,
      misinformation: 15,
      copyright: 20
    },
    flaggedPhrases: ["sensitif"],
    suggestions: ["Konten terlihat aman namun perlu review manual untuk validitas"],
    confidence: 92
  },
  {
    id: 2,
    itemId: 2,
    timestamp: "2025-10-30T07:36:00Z",
    safetyScore: 45,
    categories: {
      spam: 30,
      violence: 0,
      adult: 0,
      hate: 0,
      misinformation: 10,
      copyright: 60
    },
    flaggedPhrases: ["hak cipta", "copy"],
    suggestions: ["Perlu periksa lisensi dan hak cipta foto", "Pastikan ada izin penggunaan"],
    confidence: 78
  }
];

export const ModerationPage = () => {
  const [rows, setRows] = useState<ModerationItemEnhanced[]>([
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
      fullContent: "Sanwati Pondok Pesantren Darul Falah, Anisa Rahmawati (15 tahun), berhasil meraih juara 1 dalam Olimpiade Sains Nasional bidang Matematika yang diselenggarakan di Jakarta. Prestasi ini diraih setelah melalui seleksi bertahap dari tingkat kabupaten hingga nasional.",
      aiScore: 85,
      flaggedKeywords: ["sensitif"],
      escalationLevel: 1,
      autoApproved: false,
      version: 1,
      createdBy: "Admin Pondok",
      category: "Prestasi",
      tags: ["pendidikan", "sains", "olimpiade", "sanwati"]
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
      fullContent: "Dokumentasi lengkap kegiatan Pramuka Pondok Al-Ikhlas yang berlangsung pada 12 Oktober 2025.",
      aiScore: 45,
      flaggedKeywords: ["hak cipta", "copy"],
      escalationLevel: 2,
      autoApproved: false,
      version: 1,
      createdBy: "Admin Pondok",
      fileSize: 2048576,
      mimeType: "image/jpeg"
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
      fullContent: "Artikel mendalam mengenai implementasi sistem manajemen keuangan berbasis digital di Pondok Pesantren Tahfidz Al-Qur'an.",
      aiScore: 92,
      flaggedKeywords: [],
      escalationLevel: 0,
      autoApproved: false,
      version: 2,
      createdBy: "Admin Pondok",
      category: "Manajemen"
    }
  ]);

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "all",
    priority: "all",
    pondok: ""
  });

  const [selectedItem, setSelectedItem] = useState<ModerationItemEnhanced | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const updateStatus = (id: number, status: ModerationItemEnhanced["status"], notes?: string) => {
    setRows(prev => prev.map(r =>
      r.id === id ? {
        ...r,
        status,
        moderatedDate: new Date().toISOString().split('T')[0],
        moderatorName: "Super Admin",
        version: r.version + 1,
        lastModified: new Date().toISOString()
      } : r
    ));
  };

  const accept = (id: number, notes?: string) => updateStatus(id, "approved", notes);
  const reject = (id: number, notes?: string) => updateStatus(id, "rejected", notes);
  const flag = (id: number, notes?: string) => updateStatus(id, "flagged", notes);

  const getTypeIcon = (type: ModerationItemEnhanced["type"]) => {
    switch (type) {
      case "news": return <FileText className="w-4 h-4 text-blue-500" />;
      case "article": return <FileText className="w-4 h-4 text-green-500" />;
      case "photo": return <Image className="w-4 h-4 text-purple-500" />;
      case "video": return <Video className="w-4 h-4 text-red-500" />;
      case "comment": return <MessageCircle className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: ModerationItemEnhanced["status"]) => {
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

  const getPriorityBadge = (priority: ModerationItemEnhanced["priority"]) => {
    const priorityConfig = {
      low: { variant: "secondary" as const, label: "Rendah" },
      medium: { variant: "info" as const, label: "Sedang" },
      high: { variant: "destructive" as const, label: "Tinggi" }
    };
    const config = priorityConfig[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getAIBadge = (aiScore?: number) => {
    if (!aiScore) return null;
    const color = aiScore >= 90 ? "text-green-600" : aiScore >= 70 ? "text-yellow-600" : aiScore >= 50 ? "text-orange-600" : "text-red-600";
    return (
      <Badge variant="outline" className="gap-1">
        <Brain className="w-3 h-3" />
        <span className={color}>AI: {aiScore}/100</span>
      </Badge>
    );
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

  const pendingCount = rows.filter(r => r.status === "pending").length;
  const flaggedCount = rows.filter(r => r.status === "flagged").length;
  const inProgressCount = rows.filter(r => r.status === "in-progress").length;

  const getAIAnalysis = (itemId: number) => {
    return sampleAIAnalysis.find(analysis => analysis.itemId === itemId);
  };

  // Table columns configuration
  const tableColumns = [
    {
      key: 'id',
      label: 'ID',
      render: (value: number) => (
        <Badge variant="outline" className="text-xs">
          #{value}
        </Badge>
      ),
      hideOnMobile: false
    },
    {
      key: 'type',
      label: 'Jenis',
      render: (value: string, row: ModerationItemEnhanced) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(value as ModerationItemEnhanced["type"])}
          <span className="text-sm font-medium">{value === "news" ? "Berita" : value === "article" ? "Artikel" : value === "photo" ? "Foto" : value === "video" ? "Video" : "Komentar"}</span>
        </div>
      ),
      hideOnMobile: false
    },
    {
      key: 'title',
      label: 'Judul Konten',
      render: (value: string, row: ModerationItemEnhanced) => (
        <div className="max-w-xs">
          <div className="font-medium text-sm line-clamp-2">{value}</div>
          <div className="text-xs text-gray-500 mt-1">{row.pondok} (ID: {row.pondokId})</div>
        </div>
      ),
      hideOnMobile: false
    },
    {
      key: 'aiScore',
      label: 'AI Score',
      render: (value?: number) => getAIBadge(value),
      hideOnMobile: true
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => getStatusBadge(value as ModerationItemEnhanced["status"]),
      hideOnMobile: false
    },
    {
      key: 'priority',
      label: 'Prioritas',
      render: (value: string) => getPriorityBadge(value as ModerationItemEnhanced["priority"]),
      hideOnMobile: true
    },
    {
      key: 'submittedDate',
      label: 'Tanggal',
      render: (value: string, row: ModerationItemEnhanced) => (
        <div className="text-sm">
          <div>{value}</div>
          {row.moderatedDate && (
            <div className="text-xs text-gray-500">Mod: {row.moderatedDate}</div>
          )}
        </div>
      ),
      hideOnMobile: true
    }
  ];

  // Render actions for each row
  const renderActions = (row: ModerationItemEnhanced) => (
    <div className="flex justify-center gap-1">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setSelectedItem(row);
          setShowPreviewModal(true);
        }}
        title="Preview"
        className="px-3 py-1"
      >
        <Eye className="w-4 h-4" />
      </Button>

      {row.status === "pending" || row.status === "flagged" ? (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => accept(row.id)}
            title="Setujui"
            className="px-3 py-1 border-green-200 hover:bg-green-50 text-green-600 hover:text-green-700"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => reject(row.id)}
            title="Tolak"
            className="px-3 py-1 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
          {row.status !== "flagged" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => flag(row.id)}
              title="Tandai"
              className="px-3 py-1 border-yellow-200 hover:bg-yellow-50 text-yellow-600 hover:text-yellow-700"
            >
              <Shield className="w-4 h-4" />
            </Button>
          )}
        </>
      ) : row.status === "in-progress" ? (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => accept(row.id)}
            title="Setujui"
            className="px-3 py-1 border-green-200 hover:bg-green-50 text-green-600 hover:text-green-700"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => reject(row.id)}
            title="Tolak"
            className="px-3 py-1 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateStatus(row.id, "pending")}
          title="Buka Ulang"
          className="px-3 py-1 border-blue-200 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Moderasi Konten</h1>
        <p className="text-muted-foreground">Kelola moderasi konten dari semua pondok pesantren dengan AI Analysis</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Menunggu Moderasi</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Diproses</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Filter className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ditandai</p>
                <p className="text-2xl font-bold text-yellow-600">{flaggedCount}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
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
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  value={filters.pondok}
                  onChange={e => setFilters(prev => ({ ...prev, pondok: e.target.value }))}
                >
                  <option value="">Semua Pondok</option>
                  {Array.from(new Set(rows.map(r => r.pondok))).map(pondok => (
                    <option key={pondok} value={pondok}>{pondok}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Daftar Moderasi ({filteredRows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveTable
            data={currentItems}
            columns={tableColumns}
            keyField="id"
            actions={renderActions}
            emptyMessage="Tidak ada konten yang sesuai dengan filter yang dipilih"
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Menampilkan {indexOfFirstItem + 1} hingga {Math.min(indexOfLastItem, filteredRows.length)} dari {filteredRows.length} data
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Preview Modal */}
      <ContentPreviewModal
        item={selectedItem}
        aiAnalysis={selectedItem ? getAIAnalysis(selectedItem.id) : undefined}
        open={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedItem(null);
        }}
        onApprove={accept}
        onReject={reject}
        onFlag={flag}
      />
    </div>
  );
};