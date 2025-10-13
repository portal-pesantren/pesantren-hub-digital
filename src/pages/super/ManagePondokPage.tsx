import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Building2, CheckCircle2, XCircle, Star, Slash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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
  status: "verified" | "pending" | "rejected";
  founded: number;
  students: number;
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
}

export const ManagePondokPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Pondok[]>([
    { id: 1, name: "Pondok Pesantren Darul Falah", city: "Bogor", province: "Jawa Barat", status: "verified", founded: 1998, students: 520, description: "Pesantren dengan fokus tahfidz dan kitab kuning.", featured: true, suspended: false, lastLogin: "2025-10-03 08:02", lastUpdate: "2025-10-02" },
    { id: 2, name: "Pesantren Modern Al-Ikhlas", city: "Surabaya", province: "Jawa Timur", status: "pending", founded: 2005, students: 340, description: "Pendidikan modern berpadu nilai Islam.", featured: false, suspended: false, lastLogin: "2025-10-02 20:10", lastUpdate: "2025-09-30" },
    { id: 3, name: "Pondok Tahfidz Al-Qur'an", city: "Bandung", province: "Jawa Barat", status: "verified", founded: 2010, students: 280, description: "Fokus pada tahfidz dan tahsin.", featured: true, suspended: false, lastLogin: "2025-10-01 10:22", lastUpdate: "2025-10-01" },
  ]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Pondok | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [provinceFilter, setProvinceFilter] = useState<string>("all");
  const [suspendFilter, setSuspendFilter] = useState<string>("all");

  const form = useForm<PondokFormData>({
    defaultValues: { name: "", city: "", province: "", founded: new Date().getFullYear(), description: "" },
  });

  const filtered = items.filter(i => {
    const matchText = [i.name, i.city, i.province].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    const matchProvince = provinceFilter === "all" || i.province === provinceFilter;
    const matchSuspend = suspendFilter === "all" || (suspendFilter === "suspended" ? i.suspended : !i.suspended);
    return matchText && matchStatus && matchProvince && matchSuspend;
  });

  const startCreate = () => {
    setEditing(null);
    form.reset({ name: "", city: "", province: "", founded: new Date().getFullYear(), description: "" });
    setOpenForm(true);
  };

  const startEdit = (row: Pondok) => {
    setEditing(row);
    form.reset({ name: row.name, city: row.city, province: row.province, founded: row.founded, description: row.description });
    setOpenForm(true);
  };

  const onSubmit = (data: PondokFormData) => {
    if (editing) {
      setItems(prev => prev.map(p => p.id === editing.id ? { ...p, ...data } as Pondok : p));
    } else {
      const newItem: Pondok = {
        id: Math.max(0, ...items.map(i => i.id)) + 1,
        name: data.name,
        city: data.city,
        province: data.province,
        founded: data.founded,
        students: 0,
        status: "pending",
        description: data.description,
      };
      setItems(prev => [...prev, newItem]);
    }
    setOpenForm(false);
  };

  const remove = (id: number) => setItems(prev => prev.filter(p => p.id !== id));
  const verify = (id: number) => setItems(prev => prev.map(p => p.id === id ? { ...p, status: "verified" } : p));
  const reject = (id: number) => setItems(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" } : p));
  const toggleFeatured = (id: number) => setItems(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  const toggleSuspend = (id: number) => setItems(prev => prev.map(p => p.id === id ? { ...p, suspended: !p.suspended } : p));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kelola Pondok</h1>
          <p className="text-muted-foreground">Manajemen daftar pondok di seluruh portal</p>
        </div>
        <Button className="bg-gradient-primary text-white shadow-elegant" onClick={startCreate}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Pondok
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Cari pondok / kota / provinsi..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={provinceFilter} onValueChange={setProvinceFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Provinsi" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Provinsi</SelectItem>
                <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
                <SelectItem value="Jawa Timur">Jawa Timur</SelectItem>
              </SelectContent>
            </Select>
            <Select value={suspendFilter} onValueChange={setSuspendFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status Akses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Akses</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Daftar Pondok ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Pondok</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Berdiri</TableHead>
                  <TableHead>Santri</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aktivitas</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p, idx) => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 hover:shadow-md"
                    onClick={() => navigate(`/manage-pondok/${p.id}`)}
                  >
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.city}, {p.province}</TableCell>
                    <TableCell>{p.founded}</TableCell>
                    <TableCell>{p.students.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={p.status === "verified" ? "default" : p.status === "pending" ? "secondary" : "outline"}>{p.status}</Badge>
                        {p.suspended && (<Badge variant="destructive">suspended</Badge>)}
                        {p.featured && (<Badge variant="secondary">featured</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        <div>Login: {p.lastLogin || "-"}</div>
                        <div>Update: {p.lastUpdate || "-"}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant={p.featured ? "default" : "outline"} onClick={() => toggleFeatured(p.id)} title="Featured">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant={p.suspended ? "default" : "outline"} onClick={() => toggleSuspend(p.id)} title="Suspend">
                        <Slash className="w-4 h-4" />
                      </Button>
                      {p.status !== "verified" && (
                        <Button size="sm" variant="outline" onClick={() => verify(p.id)} title="Verify">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      )}
                      {p.status !== "rejected" && (
                        <Button size="sm" variant="outline" onClick={() => reject(p.id)} title="Reject">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => startEdit(p)} title="Edit">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-destructive" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Pondok?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini akan menghapus {p.name} secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(p.id)}>Hapus</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Pondok" : "Tambah Pondok"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormControl><Textarea rows={4} {...field} placeholder="Deskripsi singkat" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpenForm(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};


