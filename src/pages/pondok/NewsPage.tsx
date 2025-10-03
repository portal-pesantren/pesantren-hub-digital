import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileText, Plus, Eye, Edit, Trash2, Clock, Search, Filter, Save, X } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSchema, type NewsFormData } from "@/lib/validations";

// Types
interface NewsArticle {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  views: number;
  status: "published" | "draft";
  tags?: string;
  featured?: boolean;
}

export const NewsPage = () => {
  const [isNewsFormOpen, setIsNewsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // State management untuk data news
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([
  {
    id: 1,
    title: "Prestasi Santri Al-Hikmah di Kompetisi Tahfidz Nasional",
      content: "Tiga santri pondok pesantren Al-Hikmah berhasil meraih juara di kompetisi tahfidz tingkat nasional yang diselenggarakan di Jakarta. Prestasi ini membanggakan seluruh keluarga besar pondok pesantren...",
    excerpt: "Tiga santri pondok pesantren Al-Hikmah berhasil meraih juara di kompetisi tahfidz tingkat nasional...",
    category: "Prestasi",
    author: "Admin Pondok",
    date: "2025-10-01",
    views: 1234,
      status: "published",
      tags: "tahfidz, prestasi, kompetisi",
      featured: true
  },
  {
    id: 2,
    title: "Pembukaan Pendaftaran Santri Baru Tahun 2025/2026",
      content: "Pondok Pesantren Al-Hikmah membuka pendaftaran santri baru untuk tahun ajaran 2025/2026. Pendaftaran dibuka mulai tanggal 1 November 2025 hingga 31 Desember 2025...",
    excerpt: "Pondok Pesantren Al-Hikmah membuka pendaftaran santri baru untuk tahun ajaran 2025/2026...",
    category: "Pengumuman",
    author: "Admin Pondok",
    date: "2025-09-28",
    views: 2156,
      status: "published",
      tags: "pendaftaran, santri baru",
      featured: false
  },
  {
    id: 3,
    title: "Renovasi Gedung Asrama Putri Tahap 2",
      content: "Alhamdulillah, renovasi gedung asrama putri tahap 2 telah selesai dilaksanakan. Renovasi ini meliputi perbaikan fasilitas kamar mandi, penambahan ruang belajar, dan peningkatan keamanan...",
    excerpt: "Alhamdulillah, renovasi gedung asrama putri tahap 2 telah selesai dilaksanakan...",
    category: "Berita",
    author: "Admin Pondok",
    date: "2025-09-25",
    views: 856,
      status: "published",
      tags: "renovasi, fasilitas",
      featured: false
  },
  {
    id: 4,
    title: "Kegiatan Bakti Sosial Ramadhan 1446 H",
      content: "Persiapan kegiatan bakti sosial dalam rangka menyambut bulan suci Ramadhan 1446 H. Kegiatan ini akan melibatkan seluruh santri dan ustadz untuk membantu masyarakat sekitar...",
    excerpt: "Persiapan kegiatan bakti sosial dalam rangka menyambut bulan suci Ramadhan...",
    category: "Kegiatan",
    author: "Admin Pondok",
    date: "2025-09-20",
    views: 645,
      status: "draft",
      tags: "ramadhan, bakti sosial",
      featured: false
    }
  ]);

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: "",
      featured: false,
    },
  });

  // CRUD Functions
  const handleAddArticle = (data: NewsFormData) => {
    const newArticle: NewsArticle = {
      id: Math.max(...newsArticles.map(a => a.id)) + 1,
      title: data.title,
      content: data.content,
      excerpt: data.content.substring(0, 100) + "...",
      category: data.category,
      author: "Admin Pondok",
      date: new Date().toISOString().split('T')[0],
      views: 0,
      status: "draft",
      tags: data.tags,
      featured: data.featured,
    };
    setNewsArticles([...newsArticles, newArticle]);
    setIsNewsFormOpen(false);
    form.reset();
  };

  const handleEditArticle = (data: NewsFormData) => {
    if (editingArticle) {
      setNewsArticles(newsArticles.map(article => 
        article.id === editingArticle.id 
          ? { 
              ...article, 
              title: data.title,
              content: data.content,
              excerpt: data.content.substring(0, 100) + "...",
              category: data.category,
              tags: data.tags,
              featured: data.featured,
            }
          : article
      ));
      setEditingArticle(null);
      setIsNewsFormOpen(false);
      form.reset();
    }
  };

  const handleDeleteArticle = (id: number) => {
    setNewsArticles(newsArticles.filter(article => article.id !== id));
  };

  const handlePublishArticle = (id: number) => {
    setNewsArticles(newsArticles.map(article => 
      article.id === id 
        ? { ...article, status: "published" as const }
        : article
    ));
  };

  const handleDraftArticle = (id: number) => {
    setNewsArticles(newsArticles.map(article => 
      article.id === id 
        ? { ...article, status: "draft" as const }
        : article
    ));
  };

  // Filter data berdasarkan pencarian dan kategori
  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Statistik dinamis
  const totalArticles = newsArticles.length;
  const publishedArticles = newsArticles.filter(a => a.status === "published").length;
  const draftArticles = newsArticles.filter(a => a.status === "draft").length;
  const totalViews = newsArticles.reduce((sum, article) => sum + article.views, 0);

  const categories = ["all", "Prestasi", "Pengumuman", "Berita", "Kegiatan"];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Prestasi": "bg-primary/10 text-primary",
    "Pengumuman": "bg-accent/10 text-accent",
    "Berita": "bg-blue-500/10 text-blue-600",
    "Kegiatan": "bg-green-500/10 text-green-600"
  };
  return colors[category] || "bg-secondary";
};

  const onSubmit = (data: NewsFormData) => {
    if (editingArticle) {
      handleEditArticle(data);
    } else {
      handleAddArticle(data);
    }
  };

  const openEditForm = (article: NewsArticle) => {
    setEditingArticle(article);
    form.reset({
      title: article.title,
      content: article.content,
      category: article.category,
      tags: article.tags || "",
      featured: article.featured || false,
    });
    setIsNewsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Berita & Artikel</h1>
          <p className="text-muted-foreground">Kelola berita dan artikel pondok pesantren</p>
        </div>
        <Button 
          className="bg-gradient-primary text-white shadow-elegant"
          onClick={() => {
            setEditingArticle(null);
            form.reset();
            setIsNewsFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tulis Artikel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Artikel"
          value={totalArticles}
          icon={FileText}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Dipublikasikan"
          value={publishedArticles}
          icon={FileText}
        />
        <StatCard
          title="Draft"
          value={draftArticles}
          icon={FileText}
        />
        <StatCard
          title="Total Views"
          value={totalViews.toLocaleString()}
          icon={Eye}
          trend={{ value: 18.3, isPositive: true }}
        />
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? "Semua" : category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Semua Artikel ({filteredArticles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div 
                key={article.id}
                className="p-6 rounded-lg border bg-card hover:shadow-card transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{article.title}</h3>
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                      {article.status === "draft" && (
                        <Badge variant="outline">Draft</Badge>
                      )}
                      {article.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(article.date).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span>•</span>
                      <span>{article.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.views.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setNewsArticles(newsArticles.map(a => 
                          a.id === article.id ? { ...a, views: a.views + 1 } : a
                        ));
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openEditForm(article)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {article.status === "draft" ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-green-600"
                        onClick={() => handlePublishArticle(article.id)}
                      >
                        Publish
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-yellow-600"
                        onClick={() => handleDraftArticle(article.id)}
                      >
                        Draft
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus artikel <strong>{article.title}</strong>? 
                            Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteArticle(article.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* News Form */}
      <Dialog open={isNewsFormOpen} onOpenChange={setIsNewsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {editingArticle ? "Edit Artikel" : "Tulis Artikel Baru"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Artikel</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan judul artikel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Prestasi">Prestasi</SelectItem>
                          <SelectItem value="Pengumuman">Pengumuman</SelectItem>
                          <SelectItem value="Berita">Berita</SelectItem>
                          <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konten Artikel</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={10} 
                        placeholder="Tulis konten artikel di sini..."
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="tag1, tag2, tag3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Artikel Unggulan</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsNewsFormOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </Button>
                <Button type="submit" className="bg-gradient-primary">
                  <Save className="w-4 h-4 mr-2" />
                  {editingArticle ? "Simpan Perubahan" : "Simpan Artikel"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};