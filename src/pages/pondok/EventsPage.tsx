import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Plus, Clock, MapPin, Users as UsersIcon, Edit, Trash2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { EventForm } from "@/components/forms/EventForm";
import { type EventFormData } from "@/lib/validations";

// Types
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  category: string;
  status: "upcoming" | "completed" | "cancelled";
  maxParticipants?: number;
}

export const EventsPage = () => {
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // State management untuk data events
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Wisuda Santri Angkatan 16",
      description: "Upacara wisuda santri angkatan 16 dengan tema 'Generasi Qurani yang Berakhlakul Karimah'",
      date: "2025-10-15",
      time: "08:00",
      location: "Aula Utama",
      participants: 85,
      category: "Event Besar",
      status: "upcoming",
      maxParticipants: 100
    },
    {
      id: 2,
      title: "Khataman Al-Quran Bersama",
      description: "Kegiatan khataman Al-Quran bersama seluruh santri dan ustadz",
      date: "2025-10-08",
      time: "19:00",
      location: "Masjid Al-Hikmah",
      participants: 320,
      category: "Kegiatan Rutin",
      status: "upcoming",
      maxParticipants: 500
    },
    {
      id: 3,
      title: "Penerimaan Santri Baru 2025",
      description: "Pendaftaran dan seleksi santri baru untuk tahun ajaran 2025/2026",
      date: "2025-11-01",
      time: "08:00",
      location: "Gedung Pendaftaran",
      participants: 150,
      category: "Pendaftaran",
      status: "upcoming",
      maxParticipants: 200
    },
    {
      id: 4,
      title: "Peringatan Maulid Nabi Muhammad SAW",
      description: "Peringatan hari kelahiran Nabi Muhammad SAW dengan berbagai kegiatan",
      date: "2025-09-27",
      time: "08:00",
      location: "Aula Utama",
      participants: 450,
      category: "Event Besar",
      status: "completed",
      maxParticipants: 500
    },
    {
      id: 5,
      title: "Kajian Kitab Kuning Mingguan",
      description: "Kajian rutin kitab kuning setiap minggu",
      date: "2025-09-25",
      time: "19:00",
      location: "Masjid Al-Hikmah",
      participants: 180,
      category: "Kegiatan Rutin",
      status: "completed",
      maxParticipants: 200
    }
  ]);

  // CRUD Functions
  const handleAddEvent = (data: EventFormData) => {
    const newEvent: Event = {
      id: Math.max(...events.map(e => e.id)) + 1,
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      location: data.location,
      participants: 0,
      category: data.category,
      status: "upcoming",
      maxParticipants: data.maxParticipants,
    };
    setEvents([...events, newEvent]);
    setIsEventFormOpen(false);
  };

  const handleEditEvent = (data: EventFormData) => {
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...data }
          : event
      ));
      setEditingEvent(null);
      setIsEventFormOpen(false);
    }
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleCancelEvent = (id: number) => {
    setEvents(events.map(event => 
      event.id === id 
        ? { ...event, status: "cancelled" as const }
        : event
    ));
  };

  // Filter events
  const upcomingEvents = events.filter(event => event.status === "upcoming");
  const recentEvents = events.filter(event => event.status === "completed");

  // Statistik dinamis
  const totalEvents = events.length;
  const upcomingCount = upcomingEvents.length;
  const completedCount = recentEvents.length;
  const totalParticipants = events.reduce((sum, event) => sum + event.participants, 0);

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-primary/10 text-primary";
      case "completed":
        return "bg-green-500/10 text-green-600";
      case "cancelled":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-secondary";
    }
  };

  const getStatusText = (status: Event["status"]) => {
    switch (status) {
      case "upcoming":
        return "Mendatang";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kegiatan & Event</h1>
          <p className="text-muted-foreground">Kelola jadwal kegiatan dan event pondok pesantren</p>
        </div>
        <Button 
          className="bg-gradient-primary text-white shadow-elegant"
          onClick={() => {
            setEditingEvent(null);
            setIsEventFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Event"
          value={totalEvents}
          icon={Calendar}
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title="Event Mendatang"
          value={upcomingCount}
          icon={Calendar}
        />
        <StatCard
          title="Event Selesai"
          value={completedCount}
          icon={Calendar}
        />
        <StatCard
          title="Total Peserta"
          value={totalParticipants.toLocaleString()}
          icon={UsersIcon}
        />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Event Mendatang ({upcomingCount})
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
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
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
                        {event.participants}/{event.maxParticipants} peserta
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(event.status)}>
                      {event.category}
                    </Badge>
                    <Badge variant="outline">
                      {getStatusText(event.status)}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setEditingEvent(event);
                      setIsEventFormOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Batalkan
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Pembatalan</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin membatalkan event <strong>{event.title}</strong>? 
                          Tindakan ini akan mengubah status event menjadi dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleCancelEvent(event.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Batalkan Event
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus event <strong>{event.title}</strong>? 
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Hapus Event
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Riwayat Event ({completedCount})</CardTitle>
          <Button variant="outline" size="sm">Lihat Semua</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div 
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1">
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
                  <Badge className={getStatusColor(event.status)}>
                    {getStatusText(event.status)}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setEditingEvent(event);
                      setIsEventFormOpen(true);
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
                          Apakah Anda yakin ingin menghapus event <strong>{event.title}</strong>? 
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Hapus Event
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Form */}
      <EventForm
        isOpen={isEventFormOpen}
        onClose={() => {
          setIsEventFormOpen(false);
          setEditingEvent(null);
        }}
        eventData={editingEvent}
        mode={editingEvent ? "edit" : "create"}
        onSubmit={editingEvent ? handleEditEvent : handleAddEvent}
      />
    </div>
  );
};