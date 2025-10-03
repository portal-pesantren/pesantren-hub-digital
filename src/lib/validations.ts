import { z } from "zod";

// Profile Pondok Validation
export const profileSchema = z.object({
  name: z.string().min(3, "Nama pondok minimal 3 karakter"),
  founded: z.number().min(1800, "Tahun berdiri tidak valid").max(new Date().getFullYear(), "Tahun berdiri tidak boleh melebihi tahun sekarang"),
  category: z.string().min(1, "Kategori harus diisi"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  vision: z.string().min(20, "Visi minimal 20 karakter"),
  mission: z.string().min(20, "Misi minimal 20 karakter"),
  facilities: z.string().min(10, "Fasilitas minimal 10 karakter"),
  phone: z.string().regex(/^(\+62|62|0)[0-9]{9,13}$/, "Format nomor telepon tidak valid"),
  email: z.string().email("Format email tidak valid"),
  website: z.string().url("Format website tidak valid").optional().or(z.literal("")),
});

// Santri Validation
export const santriSchema = z.object({
  name: z.string().min(3, "Nama santri minimal 3 karakter"),
  age: z.number().min(10, "Usia minimal 10 tahun").max(25, "Usia maksimal 25 tahun"),
  class: z.string().min(1, "Kelas harus diisi"),
  dormitory: z.string().min(1, "Asrama harus diisi"),
  parentContact: z.string().regex(/^(\+62|62|0)[0-9]{9,13}$/, "Format nomor telepon tidak valid"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  birthDate: z.string().min(1, "Tanggal lahir harus diisi"),
  entryDate: z.string().min(1, "Tanggal masuk harus diisi"),
});

// Ustadz Validation
export const ustadzSchema = z.object({
  name: z.string().min(3, "Nama ustadz minimal 3 karakter"),
  subject: z.string().min(1, "Mata pelajaran harus diisi"),
  experience: z.number().min(0, "Pengalaman tidak boleh negatif"),
  education: z.string().min(1, "Pendidikan terakhir harus diisi"),
  phone: z.string().regex(/^(\+62|62|0)[0-9]{9,13}$/, "Format nomor telepon tidak valid"),
  email: z.string().email("Format email tidak valid"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
});

// Event Validation
export const eventSchema = z.object({
  title: z.string().min(3, "Judul event minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  date: z.string().min(1, "Tanggal event harus diisi"),
  time: z.string().min(1, "Waktu event harus diisi"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  category: z.string().min(1, "Kategori harus diisi"),
  maxParticipants: z.number().min(1, "Maksimal peserta minimal 1"),
});

// News Validation
export const newsSchema = z.object({
  title: z.string().min(3, "Judul artikel minimal 3 karakter"),
  content: z.string().min(50, "Konten artikel minimal 50 karakter"),
  category: z.string().min(1, "Kategori harus diisi"),
  tags: z.string().optional(),
  featured: z.boolean().default(false),
});

// Gallery Validation
export const gallerySchema = z.object({
  title: z.string().min(3, "Judul media minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  category: z.string().min(1, "Kategori harus diisi"),
  file: z.any().refine((file) => file && file.size > 0, "File harus diupload"),
});

// Settings Validation
export const settingsSchema = z.object({
  siteTitle: z.string().min(3, "Judul website minimal 3 karakter"),
  siteDescription: z.string().min(10, "Deskripsi website minimal 10 karakter"),
  timezone: z.string().min(1, "Zona waktu harus diisi"),
  language: z.string().min(1, "Bahasa harus diisi"),
  currency: z.string().min(1, "Mata uang harus diisi"),
  maintenanceMode: z.boolean().default(false),
});

// Auth Validation
export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password saat ini harus diisi"),
  newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password baru dan konfirmasi tidak sama",
  path: ["confirmPassword"],
});

// Export types
export type ProfileFormData = z.infer<typeof profileSchema>;
export type SantriFormData = z.infer<typeof santriSchema>;
export type UstadzFormData = z.infer<typeof ustadzSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type NewsFormData = z.infer<typeof newsSchema>;
export type GalleryFormData = z.infer<typeof gallerySchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
