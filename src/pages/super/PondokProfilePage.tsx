import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Building2,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  XCircle,
  Star,
  Clock,
  Image,
  FileText,
  Award,
  BookOpen
} from "lucide-react";

interface PondokProfile {
  id: number;
  name: string;
  city: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  status: "verified" | "pending" | "rejected";
  founded: number;
  students: number;
  teachers: number;
  description: string;
  vision: string;
  mission: string[];
  facilities: string[];
  achievements: string[];
  programs: string[];
  featured?: boolean;
  suspended?: boolean;
  lastLogin?: string;
  lastUpdate?: string;
  gallery: {
    id: number;
    type: "image" | "document";
    title: string;
    url: string;
    uploadDate: string;
  }[];
  socialMedia: {
    platform: string;
    url: string;
    icon: string;
  }[];
  contact: {
    name: string;
    position: string;
    phone: string;
    email: string;
  }[];
}

export const PondokProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pondok, setPondok] = useState<PondokProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - dalam implementasi nyata ini akan diambil dari API
  const mockPondokData: PondokProfile = {
    id: 1,
    name: "Pondok Pesantren Darul Falah",
    city: "Bogor",
    province: "Jawa Barat",
    address: "Jl. KH. Abdul Halim No. 123, Kec. Bogor Tengah",
    phone: "(0251) 8321-4567",
    email: "info@darulfalah.sch.id",
    website: "www.darulfalah.sch.id",
    status: "verified",
    founded: 1998,
    students: 520,
    teachers: 45,
    description: "Pondok Pesantren Darul Falah adalah lembaga pendidikan Islam yang mengintegrasikan pendidikan formal dengan pendidikan agama Islam. Dengan fokus pada tahfidz Al-Qur'an dan kitab kuning, kami berkomitmen untuk menciptakan generasi yang berilmu dan berakhlak mulia.",
    vision: "Menjadi lembaga pendidikan Islam unggulan yang menghasilkan generasi qur'ani yang berkarakter dan berdaya saing global.",
    mission: [
      "Menyelenggarakan pendidikan Islam yang berkualitas dan komprehensif",
      "Membentuk karakter santri yang berakhlak mulia dan mandiri",
      "Mengembangkan potensi santri dalam bidang akademik dan non-akademik",
      "Menciptakan lingkungan belajar yang islami dan kondusif"
    ],
    facilities: [
      "Masjid Jami' dengan kapasitas 1000 jamaah",
      "Perpustakaan dengan 10.000+ koleksi kitab",
      "Laboratorium Komputer dan Bahasa",
      "Lapangan Olahraga Multifungsi",
      "Asrama Santri Laki-laki dan Perempuan",
      "Kantin dan Koperasi Santri",
      "Ruang Kelas Ber-AC",
      "Hotspot Area"
    ],
    achievements: [
      "Juara 1 Musabaqah Tilawatil Quran Tingkat Provinsi 2023",
      "Sekolah Adiwiyata Nasional 2022",
      "Akreditasi A dengan nilai 96",
      "Juara Umum Olimpiade Sains Islami 2023"
    ],
    programs: [
      "Program Tahfidz 30 Juz",
      "Program Kitab Kuning 6 Tahun",
      "Program Bahasa Arab dan Inggris Intensif",
      "Program Leadership dan Entrepreneurship",
      "Program Keterampilan Wirausaha"
    ],
    featured: true,
    suspended: false,
    lastLogin: "2025-10-03 08:02",
    lastUpdate: "2025-10-02",
    gallery: [
      { id: 1, type: "image", title: "Masjid Jami' Darul Falah", url: "/images/masjid.jpg", uploadDate: "2025-09-15" },
      { id: 2, type: "image", title: "Kegiatan Belajar Mengajar", url: "/images/kelas.jpg", uploadDate: "2025-09-20" },
      { id: 3, type: "image", title: "Acara Perayaan HUT Pondok", url: "/images/hut.jpg", uploadDate: "2025-08-10" },
      { id: 4, type: "document", title: "Profil Pondok 2025", url: "/documents/profil.pdf", uploadDate: "2025-01-01" },
      { id: 5, type: "document", title: "Kurikulum Pendidikan", url: "/documents/kurikulum.pdf", uploadDate: "2025-01-15" }
    ],
    socialMedia: [
      { platform: "Facebook", url: "https://facebook.com/darulfalah", icon: "facebook" },
      { platform: "Instagram", url: "https://instagram.com/darulfalah", icon: "instagram" },
      { platform: "YouTube", url: "https://youtube.com/darulfalah", icon: "youtube" }
    ],
    contact: [
      { name: "Ustadz Ahmad Fauzi, Lc., M.Pd.", position: "Kepala Pondok", phone: "0812-3456-7890", email: " kepala@darulfalah.sch.id" },
      { name: "Ustadzah Sarah Mahmudah, S.Pd.I.", position: "Wakil Kepala", phone: "0813-2345-6789", email: "wakil@darulfalah.sch.id" }
    ]
  };

  useEffect(() => {
    // Simulasi pengambilan data dari API
    const fetchPondokProfile = async () => {
      setLoading(true);
      // Dalam implementasi nyata: const response = await fetch(`/api/pondok/${id}`);
      setTimeout(() => {
        setPondok(mockPondokData);
        setLoading(false);
      }, 1000);
    };

    if (id) {
      fetchPondokProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data profil pondok...</p>
        </div>
      </div>
    );
  }

  if (!pondok) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-muted-foreground mb-4">Data pondok tidak ditemukan</h2>
        <Button onClick={() => navigate("/manage-pondok")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Pondok
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header dengan navigasi */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/manage-pondok")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{pondok.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{pondok.city}, {pondok.province}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={pondok.status === "verified" ? "default" : pondok.status === "pending" ? "secondary" : "outline"}>
            {pondok.status === "verified" && <CheckCircle2 className="w-3 h-3 mr-1" />}
            {pondok.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
            {pondok.status}
          </Badge>
          {pondok.featured && <Badge variant="secondary">Featured</Badge>}
          {pondok.suspended && <Badge variant="destructive">Suspended</Badge>}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Santri</p>
                <p className="text-xl font-semibold">{pondok.students.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ustadz</p>
                <p className="text-xl font-semibold">{pondok.teachers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Berdiri</p>
                <p className="text-xl font-semibold">{pondok.founded}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Update Terakhir</p>
                <p className="text-sm font-semibold">{pondok.lastUpdate || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs untuk konten detail */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Profil</TabsTrigger>
          <TabsTrigger value="programs">Program</TabsTrigger>
          <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
          <TabsTrigger value="gallery">Galeri</TabsTrigger>
          <TabsTrigger value="achievements">Prestasi</TabsTrigger>
          <TabsTrigger value="contact">Kontak</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informasi Umum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Informasi Umum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Alamat Lengkap</p>
                  <p className="font-medium">{pondok.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Telepon</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {pondok.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {pondok.email}
                    </p>
                  </div>
                </div>
                {pondok.website && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Website</p>
                    <p className="font-medium flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <a href={`https://${pondok.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {pondok.website}
                      </a>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sosial Media */}
            <Card>
              <CardHeader>
                <CardTitle>Media Sosial</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {pondok.socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{social.platform}</p>
                        <p className="text-sm text-muted-foreground">{social.url.replace('https://', '')}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visi dan Misi */}
          <Card>
            <CardHeader>
              <CardTitle>Visi & Misi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-primary">Visi</h4>
                <p className="text-muted-foreground leading-relaxed">{pondok.vision}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">Misi</h4>
                <ul className="space-y-2">
                  {pondok.mission.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Deskripsi */}
          <Card>
            <CardHeader>
              <CardTitle>Tentang Pondok</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{pondok.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>Program Unggulan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pondok.programs.map((program, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-muted-foreground">{program}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities">
          <Card>
            <CardHeader>
              <CardTitle>Fasilitas Pondok</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pondok.facilities.map((facility, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Building2 className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">{facility}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                Galeri & Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pondok.gallery.map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {item.type === "image" ? (
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Image className="w-8 h-8 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="p-3">
                      <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">Upload: {item.uploadDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Prestasi & Penghargaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pondok.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                    <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <p className="text-muted-foreground">{achievement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Kontak Pondok</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pondok.contact.map((contact, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-1">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{contact.position}</p>
                    <div className="space-y-2">
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};