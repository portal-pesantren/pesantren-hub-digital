import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { ContentPreviewModal } from "@/components/moderation/ContentPreviewModal";
import { Shield, Check, X, Search, Filter, FileText, Image, Video, MessageCircle, RefreshCw, Eye, Brain, AlertTriangle, Clock, Loader2, Play } from "lucide-react";
import { ModerationItemEnhanced, AIContentAnalysis } from "@/types/moderation";
import { ModerationService, ModerationResult } from "@/services/moderationService";

// Enhanced sample data dengan format yang diminta (no/id, bentuk media, nama pondok, status)
const sampleModerationItems: ModerationItemEnhanced[] = [
  {
    id: 101,
    type: "article",
    title: "Panduan Shalat Lengkap untuk Santri Pemula",
    pondok: "Pondok Pesantren Al-Hikmah",
    pondokId: 201,
    reason: "Content baru memerlukan review",
    status: "pending",
    submittedDate: "2025-10-30",
    priority: "medium",
    contentExcerpt: "Panduan lengkap shalat dari takbir hingga salam, dilengkapi dengan bacaan Arab, Latin, dan terjemahannya. Sangat cocok untuk santri pemula yang ingin memperbaiki shalatnya.",
    fullContent: "Panduan lengkap shalat dari takbir hingga salam, dilengkapi dengan bacaan Arab, Latin, dan terjemahannya. Sangat cocok untuk santri pemula yang ingin memperbaiki shalatnya. Artikel ini mencakup: 1. Persyaratan wajib shalat, 2. Rukun shalat, 3. Sunnah shalat, 4. Hal yang membatalkan shalat, 5. Waktu shalat, 6. Doa setelah shalat.",
    aiScore: 0,
    flaggedKeywords: [],
    escalationLevel: 0,
    autoApproved: false,
    version: 1,
    createdBy: "Ustadz Ahmad",
    category: "Keagamaan",
    tags: ["shalat", "ibadah", "panduan", "santri"],
    metadata: { aiAnalysis: null }
  },
  {
    id: 102,
    type: "video",
    title: "Perayaan Maulid Nabi di Pondok",
    pondok: "Pondok Pesantren Darul Falah",
    pondokId: 202,
    reason: "Video dokumentasi kegiatan",
    status: "pending",
    submittedDate: "2025-10-30",
    priority: "low",
    contentExcerpt: "Dokumentasi video perayaan Maulid Nabi Muhammad SAW dengan pembacaan shalawat dan maulid, diikuti oleh seluruh santri dan ustadz.",
    fullContent: "Video berdurasi 15 menit menampilkan dokumentasi lengkap perayaan Maulid Nabi Muhammad SAW di Pondok Pesantren Darul Falah. Acara dihadiri oleh 500+ santri, 30 ustadz, dan tamu undangan. Termasuk pembacaan maulid, shalawat, tausiyah, dan doa bersama.",
    aiScore: 0,
    flaggedKeywords: [],
    escalationLevel: 0,
    autoApproved: false,
    version: 1,
    createdBy: "Admin Pondok",
    category: "Keagamaan",
    tags: ["maulid", "nabi", "peringatan", "dokumentasi"],
    fileSize: 52428800,
    mimeType: "video/mp4",
    metadata: { aiAnalysis: null }
  },
  {
    id: 103,
    type: "photo",
    title: "Kegiatan Belajar Kelompok Santri",
    pondok: "Pondok Pesantren Nurul Iman",
    pondokId: 203,
    reason: "Photo documentation kegiatan",
    status: "pending",
    submittedDate: "2025-10-30",
    priority: "low",
    contentExcerpt: "Foto dokumentasi kegiatan belajar kelompok santri dalam mata pelajaran Bahasa Arab dengan metode aktif.",
    fullContent: "Kumpulan foto (5 foto) menampilkan kegiatan belajar kelompok santri kelas 3 Tsanawiyah dalam mata pelajaran Bahasa Arab. Santri belajar dalam kelompok kecil 4-5 orang dengan bimbingan ustadz pengampu.",
    aiScore: 0,
    flaggedKeywords: [],
    escalationLevel: 0,
    autoApproved: false,
    version: 1,
    createdBy: "Ustadzah Sarah",
    category: "Pendidikan",
    tags: ["belajar", "kelompok", "bahasa arab", "santri"],
    fileSize: 3145728,
    mimeType: "image/jpeg",
    metadata: { aiAnalysis: null }
  },
  {
    id: 104,
    type: "news",
    title: "Sanwati Juara 1 Olimpiade Sains Tingkat Provinsi",
    pondok: "Pondok Pesantren Modern Al-Ikhlas",
    pondokId: 204,
    reason: "Prestasi santri perlu diumumkan",
    status: "pending",
    submittedDate: "2025-10-30",
    priority: "high",
    contentExcerpt: "Anisa Putri, sanwati kelas 2 SMA, berhasil meraih juara 1 dalam Olimpiade Sains tingkat provinsi dalam bidang Matematika.",
    fullContent: "Anisa Putri, sanwati kelas 2 SMA Pondok Pesantren Modern Al-Ikhlas, berhasil meraih juara 1 dalam Olimpiade Sains tingkat provinsi dalam bidang Matematika. Prestasi ini diraih setelah melalui seleksi bertahap dan mengungguli 200+ peserta dari seluruh provinsi.",
    aiScore: 0,
    flaggedKeywords: [],
    escalationLevel: 0,
    autoApproved: false,
    version: 1,
    createdBy: "Admin Pondok",
    category: "Pendidikan",
    tags: ["prestasi", "sanwati", "olimpiade", "sains", "juara"],
    metadata: { aiAnalysis: null }
  },
  {
    id: 105,
    type: "comment",
    title: "Komentar pada berita prestasi",
    pondok: "Pondok Pesantren Baiturrahman",
    pondokId: 205,
    reason: "Komentar dari user perlu review",
    status: "pending",
    submittedDate: "2025-10-30",
    priority: "medium",
    contentExcerpt: "Masya Allah, anak-anak hebat! Terus berkarya untuk membanggakan pondok dan orang tua!",
    fullContent: "Masya Allah, anak-anak hebat! Terus berkarya untuk membanggakan pondok dan orang tua! Semoga menjadi inspirasi untuk santri lainnya.",
    aiScore: 0,
    flaggedKeywords: [],
    escalationLevel: 0,
    autoApproved: false,
    version: 1,
    createdBy: "User",
    category: "Sosial",
    tags: ["komentar", "support", "motivasi"],
    metadata: { aiAnalysis: null }
  }
];

export const ModerationPage = () => {
  const moderationService = ModerationService.getInstance();
  const [rows, setRows] = useState<ModerationItemEnhanced[]>(sampleModerationItems);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingIds, setAnalyzingIds] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<ModerationItemEnhanced | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "all",
    priority: "all",
    pondok: ""
  });

  // AI Analysis function
  const analyzeItemWithAI = async (itemId: number) => {
    const item = rows.find(r => r.id === itemId);
    if (!item) return;

    setAnalyzingIds(prev => [...prev, itemId]);

    try {
      const aiResult = await moderationService.analisisKontenAI(item.fullContent || item.contentExcerpt || "", item.type);
      const updatedItem = moderationService.updateItemWithAIAnalysis(item, aiResult);

      setRows(prev => prev.map(r => r.id === itemId ? updatedItem : r));
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setAnalyzingIds(prev => prev.filter(id => id !== itemId));
    }
  };

  // Batch AI Analysis
  const analyzeAllWithAI = async () => {
    setIsAnalyzing(true);
    const pendingItems = rows.filter(item => item.aiScore === 0 && item.status === "pending");

    try {
      const contents = pendingItems.map(item => ({
        id: item.id,
        content: item.fullContent || item.contentExcerpt || "",
        type: item.type
      }));

      const results = await moderationService.analisisBatch(contents);

      setRows(prev => prev.map(item => {
        const result = results.get(item.id);
        if (result) {
          return moderationService.updateItemWithAIAnalysis(item, result);
        }
        return item;
      }));
    } catch (error) {
      console.error("Batch AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

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

  const getAIBadge = (aiScore?: number, itemId?: number) => {
    if (analyzingIds.includes(itemId!)) {
      return (
        <Badge variant="outline" className="gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          Analyzing...
        </Badge>
      );
    }

    if (!aiScore) {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => itemId && analyzeItemWithAI(itemId)}
          className="gap-1 text-xs"
        >
          <Brain className="w-3 h-3" />
          Analyze
        </Button>
      );
    }

    const color = aiScore >= 90 ? "text-green-600" : aiScore >= 70 ? "text-yellow-600" : aiScore >= 50 ? "text-orange-600" : "text-red-600";
    const status = aiScore >= 90 ? "Layak" : aiScore >= 70 ? "Perlu Review" : aiScore >= 50 ? "Risiko" : "Tolak";

    return (
      <Badge
        variant={aiScore >= 90 ? "verified" : aiScore >= 70 ? "info" : aiScore >= 50 ? "warning" : "destructive"}
        className="gap-1"
      >
        <Brain className="w-3 h-3" />
        <span className={color}>AI: {aiScore}% ({status})</span>
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
    const item = rows.find(r => r.id === itemId);
    return item?.metadata?.aiAnalysis as ModerationResult | undefined;
  };

  // Table columns sesuai format yang diminta
  const tableColumns = [
    {
      key: 'id',
      label: 'No/ID',
      render: (value: number) => (
        <Badge variant="outline" className="text-xs">
          #{value}
        </Badge>
      ),
      hideOnMobile: false
    },
    {
      key: 'type',
      label: 'Bentuk Media',
      render: (value: string, row: ModerationItemEnhanced) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(value as ModerationItemEnhanced["type"])}
          <span className="text-sm font-medium capitalize">{value}</span>
        </div>
      ),
      hideOnMobile: false
    },
    {
      key: 'title',
      label: 'Judul Konten',
      render: (value: string, row: ModerationItemEnhanced) => (
        <div className="max-w-xs">
          <div className="font-medium text-sm line-clamp-1">{value}</div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{row.contentExcerpt}</div>
        </div>
      ),
      hideOnMobile: false
    },
    {
      key: 'pondok',
      label: 'Nama Pondok',
      render: (value: string, row: ModerationItemEnhanced) => (
        <div className="text-sm">
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">ID: {row.pondokId}</div>
        </div>
      ),
      hideOnMobile: true
    },
    {
      key: 'aiScore',
      label: 'AI Analysis',
      render: (value?: number, row: ModerationItemEnhanced) => getAIBadge(value, row.id),
      hideOnMobile: false
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
        <div className="text-xs">
          <div>{value}</div>
          {row.moderatedDate && (
            <div className="text-gray-500">Mod: {row.moderatedDate}</div>
          )}
        </div>
      ),
      hideOnMobile: true
    }
  ];

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
        <h1 className="text-3xl font-bold text-foreground">Sistem Moderasi Konten AI</h1>
        <p className="text-muted-foreground">Moderasi konten dengan AI untuk platform Pondok Pesantren berdasarkan nilai-nilai Islam dan etika pesantren</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <Card className="shadow-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Analyzed</p>
                <p className="text-2xl font-bold text-green-600">{rows.filter(r => r.aiScore > 0).length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Controls */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">AI Content Analysis</h3>
              <p className="text-sm text-muted-foreground">Analisis konten secara otomatis dengan AI untuk mendeteksi risiko dan kategori</p>
            </div>
            <Button
              onClick={analyzeAllWithAI}
              disabled={isAnalyzing || rows.filter(r => r.aiScore === 0).length === 0}
              className="bg-gradient-primary text-white shadow-elegant"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing All...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze All Pending
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

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