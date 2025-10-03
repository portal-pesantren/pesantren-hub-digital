import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock, MapPin, Users as UsersIcon } from "lucide-react";
import { StatCard } from "@/components/StatCard";

const upcomingEvents = [
  {
    id: 1,
    title: "Wisuda Santri Angkatan 16",
    date: "2025-10-15",
    time: "08:00 - 12:00",
    location: "Aula Utama",
    participants: 85,
    category: "Event Besar",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Khataman Al-Quran Bersama",
    date: "2025-10-08",
    time: "19:00 - 21:00",
    location: "Masjid Al-Hikmah",
    participants: 320,
    category: "Kegiatan Rutin",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Penerimaan Santri Baru 2025",
    date: "2025-11-01",
    time: "08:00 - 16:00",
    location: "Gedung Pendaftaran",
    participants: 150,
    category: "Pendaftaran",
    status: "upcoming"
  },
];

const recentEvents = [
  {
    id: 4,
    title: "Peringatan Maulid Nabi Muhammad SAW",
    date: "2025-09-27",
    participants: 450,
    category: "Event Besar",
    status: "completed"
  },
  {
    id: 5,
    title: "Kajian Kitab Kuning Mingguan",
    date: "2025-09-25",
    participants: 180,
    category: "Kegiatan Rutin",
    status: "completed"
  },
];

export const EventsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kegiatan & Event</h1>
          <p className="text-muted-foreground">Kelola jadwal kegiatan dan event pondok pesantren</p>
        </div>
        <Button className="bg-gradient-primary text-white shadow-elegant">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Event Bulan Ini"
          value={12}
          icon={Calendar}
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title="Event Mendatang"
          value={8}
          icon={Calendar}
        />
        <StatCard
          title="Kegiatan Rutin"
          value={15}
          icon={Calendar}
        />
        <StatCard
          title="Total Peserta"
          value="1.2K"
          icon={UsersIcon}
        />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Event Mendatang
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id}
                className="p-6 rounded-lg border bg-card hover:shadow-card transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{event.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" />
                        {event.participants} peserta
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary">
                    {event.category}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Detail</Button>
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline" className="text-destructive">Batalkan</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Riwayat Event</CardTitle>
          <Button variant="outline" size="sm">Lihat Semua</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div 
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-foreground">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })} • {event.participants} peserta
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{event.category}</Badge>
                  <Button variant="ghost" size="sm">Detail</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
