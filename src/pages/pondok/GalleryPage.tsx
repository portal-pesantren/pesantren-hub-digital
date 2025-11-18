import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Video, Plus, Upload, Edit, Trash2, Eye, Download, Search, Filter, Save, X } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySchema, type GalleryFormData } from "@/lib/validations";

// Types
interface MediaItem {
  id: number;
  title: string;
  description: string;
  category: string;
  type: "photo" | "video";
  url: string;
  uploadDate: string;
  size: string;
  dimensions?: string;
  duration?: string;
}

export const GalleryPage = () => {
  const [activeTab, setActiveTab] = useState("photos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMediaFormOpen, setIsMediaFormOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  // State management untuk data media
  const [mediaData, setMediaData] = useState<MediaItem[]>([
    {
      id: 1,
      title: "Masjid Al-Hikmah",
      description: "Masjid utama pondok pesantren",
      category: "Fasilitas",
      type: "photo",
      url: "/placeholder.svg",
      uploadDate: "2025-10-01",
      size: "2.4 MB",
      dimensions: "1920x1080"
    },
    {
      id: 2,
      title: "Asrama Putra",
      description: "Gedung asrama untuk santri putra",
      category: "Fasilitas",
      type: "photo",
      url: "/placeholder.svg",
      uploadDate: "2025-09-28",
      size: "1.8 MB",
      dimensions: "1920x1080"
    },
    {
      id: 3,
      title: "Kegiatan Tahfidz",
      description: "Santri sedang menghafal Al-Quran",
      category: "Kegiatan",
      type: "photo",
      url: "/placeholder.svg",
      uploadDate: "2025-09-25",
      size: "3.2 MB",
      dimensions: "1920x1080"
    },
    {
      id: 4,
      title: "Perpustakaan",
      description: "Ruang perpustakaan dengan koleksi buku",
      category: "Fasilitas",
      type: "photo",
      url: "/placeholder.svg",
      uploadDate: "2025-09-20",
      size: "2.1 MB",
      dimensions: "1920x1080"
    },
    {
      id: 5,
      title: "Virtual Tour Pondok",
      description: "Tur virtual lengkap fasilitas pondok",
      category: "Promosi",
      type: "video",
      url: "/placeholder.svg",
      uploadDate: "2025-10-01",
      size: "45.2 MB",
      duration: "5:30"
    },
    {
      id: 6,
      title: "Kegiatan Wisuda 2024",
      description: "Momen wisuda santri angkatan 2024",
      category: "Event",
      type: "video",
      url: "/placeholder.svg",
      uploadDate: "2025-09-28",
      size: "78.5 MB",
      duration: "12:45"
    },
    {
      id: 7,
      title: "Kajian Kitab Kuning",
      description: "Sesi kajian kitab kuning bersama ustadz",
      category: "Kegiatan",
      type: "video",
      url: "/placeholder.svg",
      uploadDate: "2025-09-25",
      size: "32.1 MB",
      duration: "8:20"
    }
  ]);

  const form = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      file: null,
    },
  });

  // CRUD Functions
  const handleAddMedia = (data: GalleryFormData) => {
    const newMedia: MediaItem = {
      id: Math.max(...mediaData.map(m => m.id)) + 1,
      title: data.title,
      description: data.description,
      category: data.category,
      type: data.file?.type?.startsWith('video/') ? "video" : "photo",
      url: "/placeholder.svg",
      uploadDate: new Date().toISOString().split('T')[0],
      size: "2.5 MB",
      dimensions: data.file?.type?.startsWith('video/') ? undefined : "1920x1080",
      duration: data.file?.type?.startsWith('video/') ? "5:00" : undefined,
    };
    setMediaData([...mediaData, newMedia]);
    setIsMediaFormOpen(false);
    form.reset();
  };

  const handleEditMedia = (data: GalleryFormData) => {
    if (editingMedia) {
      setMediaData(mediaData.map(media => 
        media.id === editingMedia.id 
          ? { 
              ...media, 
              title: data.title,
              description: data.description,
              category: data.category,
            }
          : media
      ));
      setEditingMedia(null);
      setIsMediaFormOpen(false);
      form.reset();
    }
  };

  const handleDeleteMedia = (id: number) => {
    setMediaData(mediaData.filter(media => media.id !== id));
  };

  const handleDeleteVideo = (id: number) => {
    setMediaData(mediaData.filter(media => media.id !== id));
  };

  // Filter data berdasarkan pencarian dan kategori
  const filteredPhotos = mediaData.filter(media => {
    const matchesSearch = media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         media.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || media.category === selectedCategory;
    const isPhoto = media.type === "photo";
    return matchesSearch && matchesCategory && isPhoto;
  });

  const filteredVideos = mediaData.filter(media => {
    const matchesSearch = media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         media.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || media.category === selectedCategory;
    const isVideo = media.type === "video";
    return matchesSearch && matchesCategory && isVideo;
  });

  // Statistik dinamis
  const totalPhotos = mediaData.filter(m => m.type === "photo").length;
  const totalVideos = mediaData.filter(m => m.type === "video").length;
  const totalSize = mediaData.reduce((sum, media) => {
    const size = parseFloat(media.size);
    return sum + size;
  }, 0);
  const categories = ["all", "Fasilitas", "Kegiatan", "Event", "Promosi"];

  const onSubmit = (data: GalleryFormData) => {
    if (editingMedia) {
      handleEditMedia(data);
    } else {
      handleAddMedia(data);
    }
  };

  const openEditForm = (media: MediaItem) => {
    setEditingMedia(media);
    form.reset({
      title: media.title,
      description: media.description,
      category: media.category,
      file: null,
    });
    setIsMediaFormOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Galeri Media</h1>
          <p className="text-responsive-sm text-muted-foreground">Kelola foto dan video pondok pesantren</p>
        </div>
        <Button
          className="bg-gradient-primary text-white shadow-elegant w-full sm:w-auto touch-target"
          onClick={() => {
            setEditingMedia(null);
            form.reset();
            setIsMediaFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Total Foto"
          value={totalPhotos}
          icon={Image}
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title="Total Video"
          value={totalVideos}
          icon={Video}
        />
        <StatCard
          title="Ukuran Total"
          value={`${totalSize.toFixed(1)} MB`}
          icon={Download}
        />
        <StatCard
          title="Kategori"
          value={categories.length - 1}
          icon={Filter}
        />
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari foto atau video..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    touch-target-sm
                    ${selectedCategory === category
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-foreground border-border hover:bg-muted hover:border-muted-foreground/50 hover:px-4 hover:py-2"
                    }
                    px-3 py-1.5 h-8
                    text-xs font-medium
                    rounded-md
                  `}
                >
                  {category === "all" ? "Semua" : category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Gallery */}
      <Card className="shadow-card">
        <CardContent className="p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-2 h-12 w-full">
              <TabsTrigger
                value="photos"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium px-4 py-2 h-9 text-sm rounded-md touch-target text-center hover:px-5 hover:py-2.5 text-responsive-sm"
              >
                Foto ({filteredPhotos.length})
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium px-4 py-2 h-9 text-sm rounded-md touch-target text-center hover:px-5 hover:py-2.5 text-responsive-sm"
              >
                Video ({filteredVideos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photos" className="mt-6">
              {filteredPhotos.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-responsive-base text-muted-foreground">
                    Tidak ada foto yang ditemukan
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredPhotos.map((photo) => (
                    <div key={photo.id} className="group relative">
                      <Card className="overflow-hidden hover:shadow-elegant transition-all duration-200 border border-border/50">
                        <div className="aspect-square relative">
                          <div className="w-full h-full bg-gradient-primary/10 flex items-center justify-center">
                            <Image className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                          </div>
                          {/* Hover Actions - Desktop Only */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary" className="touch-target-sm hidden sm:flex">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => openEditForm(photo)}
                                className="touch-target-sm"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive" className="touch-target-sm">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-md mx-4">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm">
                                      Apakah Anda yakin ingin menghapus foto <strong>{photo.title}</strong>?
                                      Tindakan ini tidak dapat dibatalkan.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="touch-target">Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteMedia(photo.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 touch-target"
                                    >
                                      Hapus
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3 sm:p-4">
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium text-responsive-sm line-clamp-2 flex-1">{photo.title}</h3>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                {photo.category}
                              </Badge>
                            </div>
                            <p className="text-responsive-xs text-muted-foreground line-clamp-2">
                              {photo.description}
                            </p>
                            <div className="flex justify-between text-responsive-xs text-muted-foreground">
                              <span>{photo.dimensions}</span>
                              <span>{photo.size}</span>
                            </div>
                            {/* Mobile Quick Actions */}
                            <div className="flex gap-2 pt-2 border-t border-border/50 sm:hidden">
                              <Button size="sm" variant="outline" className="flex-1 touch-target-sm">
                                <Eye className="w-3 h-3 mr-1" />
                                Lihat
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditForm(photo)}
                                className="flex-1 touch-target-sm"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-responsive-base text-muted-foreground">
                    Tidak ada video yang ditemukan
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="group relative">
                      <Card className="overflow-hidden hover:shadow-elegant transition-all duration-200 border border-border/50">
                        <div className="aspect-video relative">
                          <div className="w-full h-full bg-gradient-primary/10 flex items-center justify-center">
                            <Video className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                          </div>
                          {/* Duration Badge */}
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                          {/* Hover Actions - Desktop Only */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary" className="touch-target-sm hidden sm:flex">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => openEditForm(video)}
                                className="touch-target-sm"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive" className="touch-target-sm">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-md mx-4">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm">
                                      Apakah Anda yakin ingin menghapus video <strong>{video.title}</strong>?
                                      Tindakan ini tidak dapat dibatalkan.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="touch-target">Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteVideo(video.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 touch-target"
                                    >
                                      Hapus
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3 sm:p-4">
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium text-responsive-sm line-clamp-2 flex-1">{video.title}</h3>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                {video.category}
                              </Badge>
                            </div>
                            <p className="text-responsive-xs text-muted-foreground line-clamp-2">
                              {video.description}
                            </p>
                            <div className="flex justify-between text-responsive-xs text-muted-foreground">
                              <span>{video.duration}</span>
                              <span>{video.size}</span>
                            </div>
                            {/* Mobile Quick Actions */}
                            <div className="flex gap-2 pt-2 border-t border-border/50 sm:hidden">
                              <Button size="sm" variant="outline" className="flex-1 touch-target-sm">
                                <Eye className="w-3 h-3 mr-1" />
                                Play
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditForm(video)}
                                className="flex-1 touch-target-sm"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Media Upload Form */}
      <Dialog open={isMediaFormOpen} onOpenChange={setIsMediaFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              {editingMedia ? "Edit Media" : "Upload Media Baru"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan judul media" {...field} />
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
                            <SelectValue placeholder="Kategori media" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fasilitas">Fasilitas</SelectItem>
                          <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                          <SelectItem value="Event">Event</SelectItem>
                          <SelectItem value="Promosi">Promosi</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Deskripsi media" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload File</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag & drop file atau klik untuk memilih
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Format: JPG, PNG, MP4, MOV (Max 50MB)
                        </p>
                        <Input 
                          type="file" 
                          accept="image/*,video/*"
                          className="mt-4"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsMediaFormOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </Button>
                <Button type="submit" className="bg-gradient-primary">
                  <Save className="w-4 h-4 mr-2" />
                  {editingMedia ? "Simpan Perubahan" : "Upload"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};