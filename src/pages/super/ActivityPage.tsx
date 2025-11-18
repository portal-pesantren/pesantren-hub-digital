import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { FileText, Image, Video, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for Berita/Artikel
const sampleNewsArticles = [
  {
    id: 201,
    title: "Prestasi Santri dalam Olimpiade Sains Nasional",
    pondok: "Pondok Pesantren Darul Falah",
    uploadedAt: "2025-10-30 14:30"
  },
  {
    id: 202,
    title: "Program Baru Tahfidz Qur'an 30 Juz",
    pondok: "Pondok Pesantren Al-Ikhlas",
    uploadedAt: "2025-10-30 10:15"
  },
  {
    id: 203,
    title: "Renovasi Masjid Pondok Selesai",
    pondok: "Pondok Pesantren Nurul Iman",
    uploadedAt: "2025-10-29 16:45"
  }
];

// Sample data for Galeri Foto
const samplePhotos = [
  {
    id: 301,
    preview: "https://picsum.photos/seed/pondok1/100/100.jpg",
    pondok: "Pondok Pesantren Darul Falah",
    caption: "Kegiatan belajar Al-Qur'an bersama",
    uploadedAt: "2025-10-30 09:20"
  },
  {
    id: 302,
    preview: "https://picsum.photos/seed/pondok2/100/100.jpg",
    pondok: "Pondok Pesantren Al-Ikhlas",
    caption: "Perayaan Maulid Nabi Muhammad SAW",
    uploadedAt: "2025-10-30 11:45"
  }
];

// Sample data for Galeri Video
const sampleVideos = [
  {
    id: 401,
    preview: "https://picsum.photos/seed/video1/100/100.jpg",
    pondok: "Pondok Pesantren Tahfidz Al-Qur'an",
    caption: "Ceramah Ramadhan 1446 H",
    uploadedAt: "2025-10-30 13:00"
  },
  {
    id: 402,
    preview: "https://picsum.photos/seed/video2/100/100.jpg",
    pondok: "Pondok Pesantren Modern Al-Hikmah",
    caption: "Wisuda Santri Angkatan 2025",
    uploadedAt: "2025-10-29 15:30"
  }
];

// Sample data for Calendar Events
const sampleEvents = [
  {
    id: 501,
    title: "Pesantren Ramadhan 1446 H",
    pondok: "Pondok Pesantren Darul Falah",
    eventDate: "2025-03-01",
    uploadedAt: "2025-10-30 08:00"
  },
  {
    id: 502,
    title: "Haflah Akhir Tahun Ajaran",
    pondok: "Pondok Pesantren Al-Ikhlas",
    eventDate: "2025-06-15",
    uploadedAt: "2025-10-29 12:30"
  },
  {
    id: 503,
    title: "Maulid Nabi Muhammad SAW",
    pondok: "Pondok Pesantren Nurul Iman",
    eventDate: "2025-09-28",
    uploadedAt: "2025-10-28 16:45"
  }
];

export const ActivityPage = () => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // News/Articles table columns
  const newsColumns = [
    {
      key: 'id',
      label: 'No/ID',
      render: (value: number) => (
        <Badge variant="outline" className="text-xs">
          #{value}
        </Badge>
      )
    },
    {
      key: 'title',
      label: 'Judul',
      render: (value: string) => (
        <span className="font-medium text-sm">{value}</span>
      )
    },
    {
      key: 'pondok',
      label: 'Nama Pondok',
      render: (value: string) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'uploadedAt',
      label: 'Uploaded At',
      render: (value: string) => (
        <span className="text-sm">{formatDateTime(value)}</span>
      )
    }
  ];

  // Gallery table columns
  const galleryColumns = [
    {
      key: 'id',
      label: 'No/ID',
      render: (value: number) => (
        <Badge variant="outline" className="text-xs">
          #{value}
        </Badge>
      )
    },
    {
      key: 'media',
      label: 'Media',
      render: (value: string, row: any) => (
        <img
          src={value}
          alt={row.caption}
          className="w-16 h-16 object-cover rounded-md"
        />
      )
    },
    {
      key: 'pondok',
      label: 'Nama Pondok',
      render: (value: string) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'caption',
      label: 'Caption',
      render: (value: string) => (
        <span className="text-sm line-clamp-2">{value}</span>
      )
    },
    {
      key: 'uploadedAt',
      label: 'Uploaded At',
      render: (value: string) => (
        <span className="text-sm">{formatDateTime(value)}</span>
      )
    }
  ];

  // Events table columns
  const eventsColumns = [
    {
      key: 'id',
      label: 'No/ID',
      render: (value: number) => (
        <Badge variant="outline" className="text-xs">
          #{value}
        </Badge>
      )
    },
    {
      key: 'title',
      label: 'Judul Event',
      render: (value: string) => (
        <span className="font-medium text-sm">{value}</span>
      )
    },
    {
      key: 'pondok',
      label: 'Nama Pondok',
      render: (value: string) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'eventDate',
      label: 'Tanggal Event',
      render: (value: string) => (
        <span className="text-sm">{formatDate(value)}</span>
      )
    },
    {
      key: 'uploadedAt',
      label: 'Uploaded At',
      render: (value: string) => (
        <span className="text-sm">{formatDateTime(value)}</span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Aktivitas</h1>
          <p className="text-muted-foreground">Pantau aktivitas berita, galeri, dan event pondok pesantren</p>
        </div>
      </div>

      <Tabs defaultValue="news" className="space-y-6">
        <TabsList className="items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-3 h-12 w-full">
          <TabsTrigger
            value="news"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-3 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Berita / Artikel
          </TabsTrigger>
          <TabsTrigger
            value="gallery"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-3 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Galeri
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-3 py-2 h-9 text-sm rounded-md touch-target text-center"
          >
            Calendar Event
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="mt-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Berita / Artikel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveTable
                headers={newsColumns}
                data={sampleNewsArticles.map(article => ({
                  id: article.id,
                  title: article.title,
                  pondok: article.pondok,
                  uploadedAt: article.uploadedAt
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" /> Galeri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="photos" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
                  <TabsTrigger value="photos" className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-3 py-2 h-9 text-sm rounded-md touch-target text-center">
                    Foto
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="data-[state=active]:bg-background data-[state=active]:border-border data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200 ease-in-out px-3 py-2 h-9 text-sm rounded-md touch-target text-center">
                    Video
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="photos">
                  <ResponsiveTable
                    headers={galleryColumns}
                    data={samplePhotos.map(photo => ({
                      id: photo.id,
                      media: photo.preview,
                      pondok: photo.pondok,
                      caption: photo.caption,
                      uploadedAt: photo.uploadedAt
                    }))}
                  />
                </TabsContent>

                <TabsContent value="videos">
                  <ResponsiveTable
                    headers={galleryColumns}
                    data={sampleVideos.map(video => ({
                      id: video.id,
                      media: video.preview,
                      pondok: video.pondok,
                      caption: video.caption,
                      uploadedAt: video.uploadedAt
                    }))}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Calendar Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveTable
                headers={eventsColumns}
                data={sampleEvents.map(event => ({
                  id: event.id,
                  title: event.title,
                  pondok: event.pondok,
                  eventDate: event.eventDate,
                  uploadedAt: event.uploadedAt
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};