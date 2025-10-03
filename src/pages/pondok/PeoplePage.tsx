import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, GraduationCap, Plus, Search, Download, Filter, Edit, Trash2, Eye } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { SantriForm } from "@/components/forms/SantriForm";
import { UstadzForm } from "@/components/forms/UstadzForm";
import { type SantriFormData } from "@/lib/validations";

// Types
interface Santri {
  id: number;
  name: string;
  class: string;
  age: number;
  status: string;
  dormitory?: string;
  parentContact?: string;
  address?: string;
  birthDate?: string;
  entryDate?: string;
}

interface Ustadz {
  id: number;
  name: string;
  subject: string;
  experience: string;
  status: string;
  education?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export const PeoplePage = () => {
  const [activeTab, setActiveTab] = useState("santri");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSantriFormOpen, setIsSantriFormOpen] = useState(false);
  const [isUstadzFormOpen, setIsUstadzFormOpen] = useState(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);
  const [editingUstadz, setEditingUstadz] = useState<Ustadz | null>(null);

  // State management untuk data
  const [santriData, setSantriData] = useState<Santri[]>([
    { id: 1, name: "Ahmad Fauzi", class: "Kelas 3 Tsanawiyah", age: 15, status: "Aktif", dormitory: "A", parentContact: "+62 812-3456-7890", address: "Jl. Merdeka No. 123", birthDate: "2010-05-15", entryDate: "2023-07-01" },
    { id: 2, name: "Muhammad Rizki", class: "Kelas 2 Aliyah", age: 17, status: "Aktif", dormitory: "B", parentContact: "+62 812-3456-7891", address: "Jl. Sudirman No. 456", birthDate: "2008-03-20", entryDate: "2022-07-01" },
    { id: 3, name: "Abdullah Rahman", class: "Kelas 1 Tsanawiyah", age: 13, status: "Aktif", dormitory: "C", parentContact: "+62 812-3456-7892", address: "Jl. Gatot Subroto No. 789", birthDate: "2012-08-10", entryDate: "2024-07-01" },
    { id: 4, name: "Yusuf Ibrahim", class: "Kelas 3 Aliyah", age: 18, status: "Aktif", dormitory: "A", parentContact: "+62 812-3456-7893", address: "Jl. Thamrin No. 321", birthDate: "2007-12-05", entryDate: "2021-07-01" },
    { id: 5, name: "Ali Hassan", class: "Kelas 2 Tsanawiyah", age: 14, status: "Cuti", dormitory: "D", parentContact: "+62 812-3456-7894", address: "Jl. Kebon Jeruk No. 654", birthDate: "2011-01-15", entryDate: "2023-07-01" },
  ]);

  const [ustadzData, setUstadzData] = useState<Ustadz[]>([
    { id: 1, name: "Ustadz H. Abdul Malik", subject: "Tafsir & Hadits", experience: "15 tahun", status: "Aktif", education: "S2 Syariah", phone: "+62 812-3456-7895", email: "abdul.malik@alhikmah.sch.id", address: "Jl. Pendidikan No. 1" },
    { id: 2, name: "Ustadz Ahmad Syarif", subject: "Fiqih & Ushul Fiqih", experience: "10 tahun", status: "Aktif", education: "S1 Syariah", phone: "+62 812-3456-7896", email: "ahmad.syarif@alhikmah.sch.id", address: "Jl. Pendidikan No. 2" },
    { id: 3, name: "Ustadzah Fatimah Zahra", subject: "Tahfidz Al-Quran", experience: "8 tahun", status: "Aktif", education: "S1 Tarbiyah", phone: "+62 812-3456-7897", email: "fatimah.zahra@alhikmah.sch.id", address: "Jl. Pendidikan No. 3" },
    { id: 4, name: "Ustadz Muhammad Amin", subject: "Bahasa Arab", experience: "12 tahun", status: "Aktif", education: "S2 Pendidikan Islam", phone: "+62 812-3456-7898", email: "muhammad.amin@alhikmah.sch.id", address: "Jl. Pendidikan No. 4" },
  ]);

  // CRUD Functions untuk Santri
  const handleAddSantri = (data: SantriFormData) => {
    const newSantri: Santri = {
      id: Math.max(...santriData.map(s => s.id)) + 1,
      name: data.name,
      class: data.class,
      age: data.age,
      status: "Aktif",
      dormitory: data.dormitory,
      parentContact: data.parentContact,
      address: data.address,
      birthDate: data.birthDate,
      entryDate: data.entryDate,
    };
    setSantriData([...santriData, newSantri]);
    setIsSantriFormOpen(false);
  };

  const handleEditSantri = (data: SantriFormData) => {
    if (editingSantri) {
      setSantriData(santriData.map(santri => 
        santri.id === editingSantri.id 
          ? { ...santri, ...data }
          : santri
      ));
      setEditingSantri(null);
      setIsSantriFormOpen(false);
    }
  };

  const handleDeleteSantri = (id: number) => {
    setSantriData(santriData.filter(santri => santri.id !== id));
  };

  // CRUD Functions untuk Ustadz
  const handleAddUstadz = (data: any) => {
    const newUstadz: Ustadz = {
      id: Math.max(...ustadzData.map(u => u.id)) + 1,
      name: data.name,
      subject: data.subject,
      experience: `${data.experience} tahun`,
      status: "Aktif",
      education: data.education,
      phone: data.phone,
      email: data.email,
      address: data.address,
    };
    setUstadzData([...ustadzData, newUstadz]);
    setIsUstadzFormOpen(false);
  };

  const handleEditUstadz = (data: any) => {
    if (editingUstadz) {
      setUstadzData(ustadzData.map(ustadz => 
        ustadz.id === editingUstadz.id 
          ? { ...ustadz, ...data, experience: `${data.experience} tahun` }
          : ustadz
      ));
      setEditingUstadz(null);
      setIsUstadzFormOpen(false);
    }
  };

  const handleDeleteUstadz = (id: number) => {
    setUstadzData(ustadzData.filter(ustadz => ustadz.id !== id));
  };

  // Filter data berdasarkan pencarian
  const filteredSantri = santriData.filter(santri =>
    santri.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    santri.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    santri.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUstadz = ustadzData.filter(ustadz =>
    ustadz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ustadz.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ustadz.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistik dinamis
  const totalSantri = santriData.length;
  const santriPutra = santriData.filter(s => s.name.includes("Ahmad") || s.name.includes("Muhammad") || s.name.includes("Abdullah") || s.name.includes("Yusuf") || s.name.includes("Ali")).length;
  const santriPutri = totalSantri - santriPutra;
  const totalUstadz = ustadzData.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Santri & Ustadz</h1>
          <p className="text-muted-foreground">Kelola data santri dan ustadz pondok pesantren</p>
        </div>
        <Button 
          className="bg-gradient-primary text-white shadow-elegant"
          onClick={() => {
            if (activeTab === "santri") {
              setEditingSantri(null);
              setIsSantriFormOpen(true);
            } else {
              setEditingUstadz(null);
              setIsUstadzFormOpen(true);
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah {activeTab === "santri" ? "Santri" : "Ustadz"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Santri"
          value={totalSantri}
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="Santri Putra"
          value={santriPutra}
          icon={Users}
        />
        <StatCard
          title="Santri Putri"
          value={santriPutri}
          icon={Users}
        />
        <StatCard
          title="Total Ustadz"
          value={totalUstadz}
          icon={GraduationCap}
          trend={{ value: 2.1, isPositive: true }}
        />
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="santri">Santri ({totalSantri})</TabsTrigger>
              <TabsTrigger value="ustadz">Ustadz ({totalUstadz})</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 my-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder={`Cari ${activeTab}...`}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <TabsContent value="santri" className="mt-0">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Nama Santri</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Usia</TableHead>
                      <TableHead>Asrama</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSantri.map((santri, index) => (
                      <TableRow key={santri.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{santri.name}</TableCell>
                        <TableCell>{santri.class}</TableCell>
                        <TableCell>{santri.age} tahun</TableCell>
                        <TableCell>{santri.dormitory}</TableCell>
                        <TableCell>
                          <Badge variant={santri.status === "Aktif" ? "default" : "secondary"}>
                            {santri.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEditingSantri(santri);
                                setIsSantriFormOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus data santri <strong>{santri.name}</strong>? 
                                    Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteSantri(santri.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="ustadz" className="mt-0">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Nama Ustadz</TableHead>
                      <TableHead>Mata Pelajaran</TableHead>
                      <TableHead>Pengalaman</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUstadz.map((ustadz, index) => (
                      <TableRow key={ustadz.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{ustadz.name}</TableCell>
                        <TableCell>{ustadz.subject}</TableCell>
                        <TableCell>{ustadz.experience}</TableCell>
                        <TableCell>
                          <Badge variant="default">{ustadz.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEditingUstadz(ustadz);
                                setIsUstadzFormOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus data ustadz <strong>{ustadz.name}</strong>? 
                                    Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteUstadz(ustadz.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Forms */}
      <SantriForm
        isOpen={isSantriFormOpen}
        onClose={() => {
          setIsSantriFormOpen(false);
          setEditingSantri(null);
        }}
        santriData={editingSantri}
        mode={editingSantri ? "edit" : "create"}
        onSubmit={editingSantri ? handleEditSantri : handleAddSantri}
      />

      <UstadzForm
        isOpen={isUstadzFormOpen}
        onClose={() => {
          setIsUstadzFormOpen(false);
          setEditingUstadz(null);
        }}
        ustadzData={editingUstadz}
        mode={editingUstadz ? "edit" : "create"}
        onSubmit={editingUstadz ? handleEditUstadz : handleAddUstadz}
      />
    </div>
  );
};