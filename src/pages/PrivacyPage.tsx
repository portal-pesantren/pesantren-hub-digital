import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, AlertTriangle } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        {/* Main Content */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Shield className="w-6 h-6 text-primary" />
              Kebijakan Privasi
            </CardTitle>
            <p className="text-muted-foreground">
              Kami berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Last Updated */}
            <div className="text-sm text-muted-foreground">
              Terakhir diperbarui: 1 Januari 2025
            </div>

            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                1. Pendahuluan
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Portal Pesantren ("kami") sangat menghargai privasi Anda dan berkomitmen untuk
                melindungi informasi pribadi yang Anda berikan. Kebijakan Privasi ini menjelaskan
                bagaimana kami mengumpulkan, menggunakan, melindungi, dan membagikan informasi Anda
                ketika Anda menggunakan layanan kami.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Database className="w-5 h-5" />
                2. Informasi yang Kami Kumpulkan
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium mb-2">2.1 Informasi Pribadi</h3>
                  <p className="text-muted-foreground mb-2">Kami dapat mengumpulkan:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Nama lengkap dan informasi identitas</li>
                    <li>Alamat email dan nomor telepon</li>
                    <li>Alamat fisik dan data lokasi</li>
                    <li>Tanggal lahir dan informasi demografis</li>
                    <li>Foto profil dan informasi pendidikan</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">2.2 Informasi Penggunaan</h3>
                  <p className="text-muted-foreground mb-2">Kami juga mengumpulkan:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Data log dan aktivitas penggunaan</li>
                    <li>Informasi perangkat dan browser</li>
                    <li>Alamat IP dan lokasi umum</li>
                    <li>Cookie dan teknologi pelacakan</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                3. Cara Kami Menggunakan Informasi
              </h2>
              <p className="text-muted-foreground mb-3">Kami menggunakan informasi Anda untuk:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Menyediakan Layanan:</strong> Memproses pendaftaran dan mengelola akun Anda</li>
                <li><strong>Personalisasi:</strong> Menyesuaikan pengalaman dan konten yang relevan</li>
                <li><strong>Komunikasi:</strong> Mengirim notifikasi penting dan informasi layanan</li>
                <li><strong>Keamanan:</strong> Melindungi platform dari penyalahgunaan dan aktivitas ilegal</li>
                <li><strong>Analisis:</strong> Menganalisis penggunaan untuk meningkatkan layanan</li>
                <li><strong>Kepatuhan:</strong> Mematuhi kewajiban hukum dan peraturan</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                4. Pembagian Data
              </h2>
              <p className="text-muted-foreground mb-3">Kami tidak menjual data pribadi Anda. Kami hanya membagikan informasi dalam situasi berikut:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Dengan Izin Anda:</strong> Ketika Anda memberikan persetujuan eksplisit</li>
                <li><strong>Penyedia Layanan:</strong> Dengan pihak ketiga yang membantu operasional kami</li>
                <li><strong>Kewajiban Hukum:</strong> Ketika diwajibkan oleh hukum atau perintah resmi</li>
                <li><strong>Transfer Bisnis:</strong> Dalam kasus merger, akuisisi, atau penjualan aset</li>
                <li><strong>Perlindungan:</strong> Untuk melindungi hak, properti, atau keselamatan kami</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Keamanan Data</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi Anda:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Enkripsi data selama transmisi dan penyimpanan</li>
                <li>Akses terbatas ke informasi pribadi</li>
                <li>Audit keamanan berkala</li>
                <li>Protokol respons insiden keamanan</li>
                <li>Kepatuhan standar keamanan industri</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Retensi Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kami menyimpan informasi pribadi hanya selama diperlukan untuk tujuan yang dikumpulkan,
                atau selama diwajibkan oleh hukum. Anda dapat meminta penghapusan data pribadi Anda
                kapan saja dengan menghubungi kami.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Hak Anda</h2>
              <p className="text-muted-foreground mb-3">Anda memiliki hak untuk:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Mengakses:</strong> Meminta salinan informasi pribadi Anda</li>
                <li><strong>Mengoreksi:</strong> Memperbaiki informasi yang tidak akurat</li>
                <li><strong>Menghapus:</strong> Meminta penghapusan data pribadi Anda</li>
                <li><strong>Membatasi:</strong> Membatasi pemrosesan data Anda</li>
                <li><strong>Memindahkan:</strong> Meminta transfer data Anda ke pihak lain</li>
                <li><strong>Menolak:</strong> Menolak pemrosesan data dalam keadaan tertentu</li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Cookie dan Pelacakan</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman Anda:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Cookie esensial untuk operasi dasar situs</li>
                <li>Cookie analitis untuk memahami penggunaan</li>
                <li>Cookie preferensi untuk personalisasi</li>
                <li>Cookie keamanan untuk perlindungan</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Anda dapat mengatur preferensi cookie melalui pengaturan browser Anda.
              </p>
            </section>

            {/* International Data Transfers */}
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Transfer Data Internasional</h2>
              <p className="text-muted-foreground leading-relaxed">
                Informasi Anda dapat ditransfer dan diproses di negara lain sesuai dengan
                operasional kami. Kami memastikan transfer data dilakukan dengan perlindungan
                yang sesuai dan mematuhi peraturan yang berlaku.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Privasi Anak</h2>
              <p className="text-muted-foreground leading-relaxed">
                Layanan kami tidak ditujukan untuk anak di bawah 18 tahun tanpa persetujuan orang tua.
                Kami tidak sengaja mengumpulkan informasi pribadi anak di bawah 18 tahun.
                Jika kami mengetahui telah mengumpulkan informasi dari anak, kami akan menghapusnya.
              </p>
            </section>

            {/* Policy Updates */}
            <section>
              <h2 className="text-xl font-semibold mb-3">11. Pembaruan Kebijakan</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan signifikan
                akan diberitahukan melalui email atau notifikasi di platform. Kami menyarankan
                Anda untuk secara berkala memeriksa kebijakan ini.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                12. Hubungi Kami
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Jika Anda memiliki pertanyaan, keluhan, atau permintaan terkait privasi Anda,
                silakan hubungi:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacy@portalpesantren.id</p>
                <p><strong>WhatsApp:</strong> +62 812-3456-7890</p>
                <p><strong>Alamat:</strong> Jl. Pendidikan No. 123, Jakarta 12345</p>
              </div>
              <p className="text-muted-foreground mt-3">
                Kami akan merespons pertanyaan Anda dalam waktu maksimal 7 hari kerja.
              </p>
            </section>

            {/* Action Buttons */}
            <div className="pt-6 border-t flex flex-col sm:flex-row gap-3">
              <Button onClick={() => navigate('/register')} className="w-full sm:w-auto">
                Saya Mengerti - Lanjutkan
              </Button>
              <Button variant="outline" onClick={() => navigate('/terms')} className="w-full sm:w-auto">
                Lihat Syarat & Ketentuan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;