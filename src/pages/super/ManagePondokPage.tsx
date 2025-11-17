import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Building2, CheckCircle2, Slash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Pondok {
  id: number;
  name: string;
  city: string;
  province: string;
  status: "verified" | "pending" | "waiting" | "in-progress" | "suspended";
  founded: number;
  students: number;
  teachers: number;
  description: string;
  featured?: boolean;
  suspended?: boolean;
  lastLogin?: string;
  lastUpdate?: string;
}

interface PondokFormData {
  name: string;
  city: string;
  province: string;
  founded: number;
  description: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  vision?: string;
  mission?: string;
  facilities?: string;
  achievements?: string;
  programs?: string;
}

export const ManagePondokPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Pondok[]>([
    { id: 1, name: "Pondok Pesantren Darul Falah", city: "Bogor", province: "Jawa Barat", status: "verified", founded: 1998, students: 520, teachers: 35, description: "Pesantren dengan fokus tahfidz dan kitab kuning.", featured: true, suspended: false, lastLogin: "2025-10-03 08:02", lastUpdate: "2025-10-02" },
    { id: 2, name: "Pesantren Modern Al-Ikhlas", city: "Surabaya", province: "Jawa Timur", status: "pending", founded: 2005, students: 340, teachers: 28, description: "Pendidikan modern berpadu nilai Islam.", featured: false, suspended: false, lastLogin: "2025-10-02 20:10", lastUpdate: "2025-09-30" },
    { id: 3, name: "Pondok Tahfidz Al-Qur'an", city: "Bandung", province: "Jawa Barat", status: "verified", founded: 2010, students: 280, teachers: 22, description: "Fokus pada tahfidz dan tahsin.", featured: true, suspended: false, lastLogin: "2025-10-01 10:22", lastUpdate: "2025-10-01" },
    { id: 4, name: "Pondok Modern Al-Hikmah", city: "Jakarta", province: "DKI Jakarta", status: "verified", founded: 2015, students: 150, teachers: 18, description: "Pesantren dengan kurikulum modern.", featured: false, suspended: true, lastLogin: "2025-09-28 14:30", lastUpdate: "2025-09-28" },
    { id: 5, name: "Pondok Pesantren Nurul Iman", city: "Malang", province: "Jawa Timur", status: "verified", founded: 1992, students: 450, teachers: 30, description: "Pesantren salaf dengan pendidikan formal.", featured: false, suspended: true, lastLogin: "2025-09-15 09:15", lastUpdate: "2025-09-20" },
    { id: 6, name: "Pondok IT Al-Azhar", city: "Tangerang", province: "Banten", status: "waiting", founded: 2018, students: 120, teachers: 15, description: "Pesantren dengan fokus teknologi dan coding.", featured: false, suspended: false, lastLogin: "2025-10-01 15:45", lastUpdate: "2025-10-01" },
    { id: 7, name: "Pondok Entrepreneur Muslim", city: "Depok", province: "Jawa Barat", status: "waiting", founded: 2020, students: 85, teachers: 12, description: "Pesantren kewirausahaan dan bisnis Islam.", featured: false, suspended: false, lastLogin: "2025-09-30 11:20", lastUpdate: "2025-09-30" },
    { id: 8, name: "Pondok Al-Fatih", city: "Semarang", province: "Jawa Tengah", status: "in-progress", founded: 2016, students: 200, teachers: 16, description: "Sedang dalam proses verifikasi dokumen.", featured: false, suspended: false, lastLogin: "2025-10-05 09:30", lastUpdate: "2025-10-05" },
  ]);
  const [openForm, setOpenForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [provinceFilter, setProvinceFilter] = useState<string>("all");
  const [suspendFilter, setSuspendFilter] = useState<string>("all");

  const form = useForm<PondokFormData>({
    defaultValues: {
      name: "",
      city: "",
      province: "",
      founded: new Date().getFullYear(),
      description: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      vision: "",
      mission: "",
      facilities: "",
      achievements: "",
      programs: ""
    },
  });

  const filtered = items.filter(i => {
    const matchText = [i.name, i.city, i.province].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    const matchProvince = provinceFilter === "all" || i.province === provinceFilter;
    const matchSuspend = suspendFilter === "all" || (suspendFilter === "suspended" ? i.suspended : !i.suspended);
    return matchText && matchStatus && matchProvince && matchSuspend;
  });

  const startCreate = () => {
    form.reset({
      name: "",
      city: "",
      province: "",
      founded: new Date().getFullYear(),
      description: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      vision: "",
      mission: "",
      facilities: "",
      achievements: "",
      programs: ""
    });
    setOpenForm(true);
  };

  const onSubmit = (data: PondokFormData) => {
    const newItem: Pondok = {
      id: Math.max(0, ...items.map(i => i.id)) + 1,
      name: data.name,
      city: data.city,
      province: data.province,
      founded: data.founded,
      students: 0,
      teachers: 0,
      status: "pending",
      description: data.description,
      featured: false,
      suspended: false,
      lastUpdate: new Date().toISOString().split('T')[0],
      address: data.address,
      phone: data.phone,
      email: data.email,
      website: data.website,
      vision: data.vision
    };
    setItems(prev => [...prev, newItem]);
    setOpenForm(false);
  };

  const toggleSuspend = (id: number) => setItems(prev => prev.map(p => p.id === id ? { ...p, suspended: !p.suspended } : p));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Kelola Pondok</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manajemen daftar pondok di seluruh portal</p>
        </div>
        <Button size="default" onClick={startCreate} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Tambah Pondok
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari pondok / kota / provinsi..."
                className="pl-10 w-full"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Provinsi" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Provinsi</SelectItem>
                  <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
                  <SelectItem value="Jawa Timur">Jawa Timur</SelectItem>
                  <SelectItem value="DKI Jakarta">DKI Jakarta</SelectItem>
                  <SelectItem value="Banten">Banten</SelectItem>
                </SelectContent>
              </Select>
              <Select value={suspendFilter} onValueChange={setSuspendFilter}>
                <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Status Akses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Akses</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            <Building2 className="w-5 h-5 text-primary" />
            Daftar Pondok ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Pondok</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p, idx) => (
                  <TableRow
                    key={p.id}
                    className={`cursor-pointer transition-colors duration-200 hover:shadow-md ${
                      p.suspended ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => navigate(`/manage-pondok/${p.id}`)}
                  >
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.city}, {p.province}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={
                            p.status === "verified" ? "verified" :
                            p.status === "in-progress" ? "in-progress" :
                            p.status === "suspended" ? "suspended" :
                            p.status === "waiting" || p.status === "pending" ? "waiting" :
                            "outline"}
                        >
                          {p.status === "in-progress" ? "In Progress" :
                           p.status === "waiting" ? "Waiting" :
                           p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </Badge>
                        {p.featured && (<Badge variant="secondary">featured</Badge>)}
                        {p.suspended && (<Badge variant="destructive">diblokir</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                      {p.suspended ? (
                        <Button
                          size="sm"
                          onClick={() => toggleSuspend(p.id)}
                          title="Aktifkan Akun"
                          className="bg-[#CFF6C7] hover:bg-[#CFF6C7]/80 text-[#02AD02] focus:outline-none focus:ring-0 active:bg-[#CFF6C7]"
                        >
                          Aktifkan
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => toggleSuspend(p.id)}
                          title="Nonaktifkan Akun"
                          className="bg-[#F6C7C7] hover:bg-[#F6C7C7]/80 text-[#D80808] focus:outline-none focus:ring-0 active:bg-[#F6C7C7]"
                        >
                          Nonaktifkan
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Pondok</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pondok</FormLabel>
                    <FormControl><Input {...field} placeholder="Nama pondok" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="city" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kota/Kabupaten</FormLabel>
                      <FormControl><Input {...field} placeholder="Kota" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="province" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provinsi</FormLabel>
                      <FormControl><Input {...field} placeholder="Provinsi" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField name="address" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Lengkap</FormLabel>
                    <FormControl><Textarea rows={2} {...field} placeholder="Alamat lengkap" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="founded" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tahun Berdiri</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="description" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl><Textarea rows={3} {...field} placeholder="Deskripsi singkat pondok" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informasi Kontak</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="phone" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telepon</FormLabel>
                      <FormControl><Input {...field} placeholder="Nomor telepon" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" {...field} placeholder="Email pondok" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField name="website" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl><Input {...field} placeholder="Website (opsional)" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

  
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" size="default" onClick={() => setOpenForm(false)}>Batal</Button>
                <Button type="submit" size="default">Simpan</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};