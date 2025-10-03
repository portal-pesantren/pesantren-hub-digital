import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, Plus, Search, Download, Filter } from "lucide-react";
import { StatCard } from "@/components/StatCard";

const santriData = [
  { id: 1, name: "Ahmad Fauzi", class: "Kelas 3 Tsanawiyah", age: 15, status: "Aktif" },
  { id: 2, name: "Muhammad Rizki", class: "Kelas 2 Aliyah", age: 17, status: "Aktif" },
  { id: 3, name: "Abdullah Rahman", class: "Kelas 1 Tsanawiyah", age: 13, status: "Aktif" },
  { id: 4, name: "Yusuf Ibrahim", class: "Kelas 3 Aliyah", age: 18, status: "Aktif" },
  { id: 5, name: "Ali Hassan", class: "Kelas 2 Tsanawiyah", age: 14, status: "Cuti" },
];

const ustadzData = [
  { id: 1, name: "Ustadz H. Abdul Malik", subject: "Tafsir & Hadits", experience: "15 tahun", status: "Aktif" },
  { id: 2, name: "Ustadz Ahmad Syarif", subject: "Fiqih & Ushul Fiqih", experience: "10 tahun", status: "Aktif" },
  { id: 3, name: "Ustadzah Fatimah Zahra", subject: "Tahfidz Al-Quran", experience: "8 tahun", status: "Aktif" },
  { id: 4, name: "Ustadz Muhammad Amin", subject: "Bahasa Arab", experience: "12 tahun", status: "Aktif" },
];

export const PeoplePage = () => {
  const [activeTab, setActiveTab] = useState("santri");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Santri & Ustadz</h1>
          <p className="text-muted-foreground">Kelola data santri dan ustadz pondok pesantren</p>
        </div>
        <Button className="bg-gradient-primary text-white shadow-elegant">
          <Plus className="w-4 h-4 mr-2" />
          Tambah {activeTab === "santri" ? "Santri" : "Ustadz"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Santri"
          value={318}
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="Santri Putra"
          value={186}
          icon={Users}
        />
        <StatCard
          title="Santri Putri"
          value={132}
          icon={Users}
        />
        <StatCard
          title="Total Ustadz"
          value={24}
          icon={GraduationCap}
          trend={{ value: 2.1, isPositive: true }}
        />
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="santri">Santri</TabsTrigger>
              <TabsTrigger value="ustadz">Ustadz</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 my-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder={`Cari ${activeTab}...`}
                  className="pl-10"
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
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {santriData.map((santri, index) => (
                      <TableRow key={santri.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{santri.name}</TableCell>
                        <TableCell>{santri.class}</TableCell>
                        <TableCell>{santri.age} tahun</TableCell>
                        <TableCell>
                          <Badge variant={santri.status === "Aktif" ? "default" : "secondary"}>
                            {santri.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Detail</Button>
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
                    {ustadzData.map((ustadz, index) => (
                      <TableRow key={ustadz.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{ustadz.name}</TableCell>
                        <TableCell>{ustadz.subject}</TableCell>
                        <TableCell>{ustadz.experience}</TableCell>
                        <TableCell>
                          <Badge variant="default">{ustadz.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Detail</Button>
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
    </div>
  );
};
