import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { santriSchema, type SantriFormData } from "@/lib/validations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Users, Save, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SantriFormProps {
  isOpen: boolean;
  onClose: () => void;
  santriData?: SantriFormData;
  mode: "create" | "edit";
  onSubmit?: (data: SantriFormData) => void;
}

export const SantriForm = ({ isOpen, onClose, santriData, mode, onSubmit }: SantriFormProps) => {
  const form = useForm<SantriFormData>({
    resolver: zodResolver(santriSchema),
    defaultValues: santriData || {
      name: "",
      age: 15,
      class: "",
      dormitory: "",
      parentContact: "",
      address: "",
      birthDate: "",
      entryDate: "",
    },
  });

  const handleSubmit = (data: SantriFormData) => {
    console.log("Santri data:", data);
    onSubmit?.(data);
    onClose();
  };

  const classes = [
    "Kelas 1 Tsanawiyah",
    "Kelas 2 Tsanawiyah", 
    "Kelas 3 Tsanawiyah",
    "Kelas 1 Aliyah",
    "Kelas 2 Aliyah",
    "Kelas 3 Aliyah"
  ];

  const dormitories = ["A", "B", "C", "D", "E", "F"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader className="pb-4 sm:pb-6">
          <DialogTitle className="flex items-center gap-2 text-responsive-lg">
            <Users className="w-5 h-5 text-primary" />
            {mode === "create" ? "Tambah Santri Baru" : "Edit Data Santri"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-responsive-base font-semibold text-foreground">Informasi Personal</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-responsive-sm">Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama lengkap"
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
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-responsive-sm">Usia</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="15"
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

            {/* Academic Information Section */}
            <div className="space-y-4">
              <h3 className="text-responsive-base font-semibold text-foreground">Informasi Akademik</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-responsive-sm">Kelas</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 sm:h-11 text-responsive-sm">
                            <SelectValue placeholder="Pilih kelas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls} value={cls} className="text-responsive-sm">
                              {cls}
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
                  name="dormitory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-responsive-sm">Asrama</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 sm:h-11 text-responsive-sm">
                            <SelectValue placeholder="Pilih asrama" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dormitories.map((dorm) => (
                            <SelectItem key={dorm} value={dorm} className="text-responsive-sm">
                              Asrama {dorm}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-responsive-base font-semibold text-foreground">Informasi Kontak</h3>

              <FormField
                control={form.control}
                name="parentContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-responsive-sm">Kontak Orang Tua</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+62 812-3456-7890"
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-responsive-sm">Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Alamat lengkap santri..."
                        {...field}
                        className="text-responsive-sm resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date Information Section */}
            <div className="space-y-4">
              <h3 className="text-responsive-base font-semibold text-foreground">Informasi Tanggal</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-responsive-sm">Tanggal Lahir</FormLabel>
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
                  name="entryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-responsive-sm">Tanggal Masuk</FormLabel>
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
              </div>
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
                {mode === "create" ? "Tambah Santri" : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
