import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Edit, Trash2, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";

const newsArticles = [
  {
    id: 1,
    title: "Prestasi Santri Al-Hikmah di Kompetisi Tahfidz Nasional",
    excerpt: "Tiga santri pondok pesantren Al-Hikmah berhasil meraih juara di kompetisi tahfidz tingkat nasional...",
    category: "Prestasi",
    author: "Admin Pondok",
    date: "2025-10-01",
    views: 1234,
    status: "published"
  },
  {
    id: 2,
    title: "Pembukaan Pendaftaran Santri Baru Tahun 2025/2026",
    excerpt: "Pondok Pesantren Al-Hikmah membuka pendaftaran santri baru untuk tahun ajaran 2025/2026...",
    category: "Pengumuman",
    author: "Admin Pondok",
    date: "2025-09-28",
    views: 2156,
    status: "published"
  },
  {
    id: 3,
    title: "Renovasi Gedung Asrama Putri Tahap 2",
    excerpt: "Alhamdulillah, renovasi gedung asrama putri tahap 2 telah selesai dilaksanakan...",
    category: "Berita",
    author: "Admin Pondok",
    date: "2025-09-25",
    views: 856,
    status: "published"
  },
  {
    id: 4,
    title: "Kegiatan Bakti Sosial Ramadhan 1446 H",
    excerpt: "Persiapan kegiatan bakti sosial dalam rangka menyambut bulan suci Ramadhan...",
    category: "Kegiatan",
    author: "Admin Pondok",
    date: "2025-09-20",
    views: 645,
    status: "draft"
  },
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Prestasi": "bg-primary/10 text-primary",
    "Pengumuman": "bg-accent/10 text-accent",
    "Berita": "bg-blue-500/10 text-blue-600",
    "Kegiatan": "bg-green-500/10 text-green-600"
  };
  return colors[category] || "bg-secondary";
};

export const NewsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Berita & Artikel</h1>
          <p className="text-muted-foreground">Kelola berita dan artikel pondok pesantren</p>
        </div>
        <Button className="bg-gradient-primary text-white shadow-elegant">
          <Plus className="w-4 h-4 mr-2" />
          Tulis Artikel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Artikel"
          value={48}
          icon={FileText}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Dipublikasikan"
          value={42}
          icon={FileText}
        />
        <StatCard
          title="Draft"
          value={6}
          icon={FileText}
        />
        <StatCard
          title="Total Views"
          value="15.2K"
          icon={Eye}
          trend={{ value: 18.3, isPositive: true }}
        />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Semua Artikel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsArticles.map((article) => (
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
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
