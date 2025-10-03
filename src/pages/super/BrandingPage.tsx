import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Search } from "lucide-react";

interface PondokBrief {
  id: number;
  name: string;
  city: string;
  featured: boolean;
}

export const BrandingPage = () => {
  const [search, setSearch] = useState("");
  const [list, setList] = useState<PondokBrief[]>([
    { id: 1, name: "Darul Falah", city: "Bogor", featured: true },
    { id: 2, name: "Al-Ikhlas", city: "Surabaya", featured: false },
    { id: 3, name: "Tahfidz Al-Qur'an", city: "Bandung", featured: true },
  ]);

  const filtered = list.filter(p => [p.name, p.city].some(v => v.toLowerCase().includes(search.toLowerCase())));
  const toggleFeatured = (id: number) => setList(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Branding Global</h1>
        <p className="text-muted-foreground">Atur pondok unggulan untuk tampilan portal utama</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Featured Pondok</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-xl mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Cari pondok..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <Card key={p.id} className="border">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{p.name}</h4>
                    <p className="text-sm text-muted-foreground">{p.city}</p>
                  </div>
                  <Button variant={p.featured ? "default" : "outline"} onClick={() => toggleFeatured(p.id)}>
                    <Star className="w-4 h-4 mr-2" /> {p.featured ? "Unggulan" : "Jadikan Unggulan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


