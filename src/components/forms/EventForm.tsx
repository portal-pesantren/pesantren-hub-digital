import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventFormData } from "@/lib/validations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar, Save, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  eventData?: EventFormData;
  mode: "create" | "edit";
  onSubmit?: (data: EventFormData) => void;
}

export const EventForm = ({ isOpen, onClose, eventData, mode, onSubmit }: EventFormProps) => {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: eventData || {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "",
      maxParticipants: 100,
    },
  });

  const handleSubmit = (data: EventFormData) => {
    console.log("Event data:", data);
    onSubmit?.(data);
    onClose();
  };

  const categories = [
    "Event Besar",
    "Kegiatan Rutin", 
    "Pendaftaran",
    "Seasonal",
    "Annual",
    "Monthly"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader className="pb-4 sm:pb-6">
          <DialogTitle className="flex items-center gap-2 text-responsive-lg">
            <Calendar className="w-5 h-5 text-primary" />
            {mode === "create" ? "Tambah Event Baru" : "Edit Event"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-responsive-base font-semibold text-foreground">Informasi Dasar</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-responsive-sm">Judul Event</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan judul event"
                          {...field}
                          className="h-10 sm:h-11 text-responsive-sm"
                        />
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
                      <FormLabel className="text-responsive-sm">Kategori</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 sm:h-11 text-responsive-sm">
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="text-responsive-sm">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-responsive-sm">Maksimal Peserta</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="h-10 sm:h-11 text-responsive-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h3 className="text-responsive-base font-semibold text-foreground">Deskripsi Event</h3>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-responsive-sm">Deskripsi Lengkap</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Deskripsi lengkap event..."
                        {...field}
                        className="text-responsive-sm resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Schedule Section */}
            <div className="space-y-4">
              <h3 className="text-responsive-base font-semibold text-foreground">Jadwal & Lokasi</h3>

              <div className="space-y-4">
                {/* Date & Time - Combined on mobile, separate on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-responsive-sm">Tanggal Event</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="h-10 sm:h-11 text-responsive-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-responsive-sm">Waktu Mulai</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="h-10 sm:h-11 text-responsive-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-responsive-sm">Lokasi</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan lokasi event"
                          {...field}
                          className="h-10 sm:h-11 text-responsive-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Quick Preview Card - Desktop Only */}
            <div className="hidden sm:block">
              <h3 className="text-responsive-base font-semibold text-foreground mb-4">Preview Event</h3>
              <Card className="border border-border/50 bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-responsive-base mb-1">
                        {form.watch("title") || "Judul Event"}
                      </h4>
                      <p className="text-responsive-sm text-muted-foreground mb-2 line-clamp-2">
                        {form.watch("description") || "Deskripsi event akan muncul di sini..."}
                      </p>
                      <div className="flex flex-wrap gap-3 text-responsive-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {form.watch("date") || "Tanggal"}
                        </span>
                        <span className="flex items-center gap-1">
                          📍 {form.watch("location") || "Lokasi"}
                        </span>
                        <span className="flex items-center gap-1">
                          👥 Max: {form.watch("maxParticipants") || "0"}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 rounded">
                      <span className="text-xs font-medium text-primary">
                        {form.watch("category") || "Kategori"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto touch-target"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-gradient-primary w-full sm:w-auto touch-target"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === "create" ? "Tambah Event" : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
