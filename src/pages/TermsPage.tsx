import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Shield, AlertCircle } from 'lucide-react';

const TermsPage: React.FC = () => {
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
              <FileText className="w-6 h-6 text-primary" />
              Syarat & Ketentuan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Last Updated */}
            <div className="text-sm text-muted-foreground">
              Terakhir diperbarui: 1 Januari 2025
            </div>

            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Pendahuluan</h2>
              <p className="text-muted-foreground leading-relaxed">
                Selamat datang di Portal Pesantren. Dengan menggunakan layanan kami, Anda setuju untuk mematuhi
                syarat dan ketentuan yang telah ditetapkan. Harap baca dengan saksama sebelum melanjutkan.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Penerimaan Syarat</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Dengan mengakses dan menggunakan Portal Pesantren, Anda menyatakan bahwa:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Anda telah membaca, memahami, dan menyetujui syarat dan ketentuan ini</li>
                <li>Anda berusia minimal 18 tahun atau memiliki izin orang tua/wali</li>
                <li>Anda memiliki kapasitas hukum untuk terikat dalam perjanjian</li>
                <li>Anda akan mematuhi semua hukum dan peraturan yang berlaku</li>
              </ul>
            </section>

            {/* User Account */}
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Akun Pengguna</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium mb-2">3.1 Pendaftaran</h3>
                  <p className="text-muted-foreground">
                    Untuk menggunakan layanan penuh, Anda harus mendaftar dan membuat akun. Anda setuju untuk:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                    <li>Memberikan informasi yang akurat, lengkap, dan terkini</li>
                    <li>Menjaga kerahasiaan informasi akun Anda</li>
                    <li>Segera memberi tahu kami jika ada penggunaan yang tidak sah</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">3.2 Tanggung Jawab Akun</h3>
                  <p className="text-muted-foreground">
                    Anda bertanggung jawab atas semua aktivitas yang terjadi di akun Anda.
                    Portal Pesantren tidak bertanggung jawab atas kerugian yang timbul dari kelalaian Anda.
                  </p>
                </div>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Penggunaan yang Diperbolehkan</h2>
              <p className="text-muted-foreground mb-3">Anda setuju untuk tidak:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Menggunakan layanan untuk tujuan ilegal atau melanggar hukum</li>
                <li>Menyebarluaskan konten yang tidak pantas, ofensif, atau melanggar hak cipta</li>
                <li>Mencoba mengakses sistem secara tidak sah atau mengganggu operasional</li>
                <li>Memalsukan identitas atau menyamar sebagai orang lain</li>
                <li>Menggunakan layanan untuk penipuan atau aktivitas penipuan lainnya</li>
              </ul>
            </section>

            {/* Privacy Policy */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                5. Kebijakan Privasi
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Privasi Anda penting bagi kami. Informasi pribadi yang Anda berikan akan
                diolah sesuai dengan Kebijakan Privasi kami. Kami berkomitmen untuk:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                <li>Melindungi informasi pribadi Anda</li>
                <li>Tidak menjual atau membagikan data Anda tanpa izin</li>
                <li>Transparan tentang penggunaan data</li>
                <li>Memberikan kontrol atas informasi Anda</li>
              </ul>
              <div className="mt-3">
                <Button variant="outline" onClick={() => navigate('/privacy')}>
                  Lihat Kebijakan Privasi
                </Button>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Hak Kekayaan Intelektual</h2>
              <p className="text-muted-foreground leading-relaxed">
                Semua konten, desain, grafik, logo, dan materi lain di Portal Pesantren
                dilindungi oleh hak cipta dan hukum kekayaan intelektual lainnya. Anda tidak diperbolehkan:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                <li>Menggunakan materi untuk tujuan komersial tanpa izin</li>
                <li>Memodifikasi atau mendistribusikan ulang konten</li>
                <li>Melanggar hak kekayaan intelektual pihak ketiga</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                7. Pembatasan Tanggung Jawab
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Portal Pesantren disediakan "apa adanya". Kami tidak memberikan jaminan apapun
                mengenai akurasi, keandalan, atau ketersediaan layanan. Kami tidak bertanggung jawab
                atas kerugian langsung atau tidak langsung yang timbul dari penggunaan layanan kami.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Terminasi</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kami berhak untuk menangguhkan atau mengakhiri akun Anda sewaktu-waktu jika
                Anda melanggar syarat dan ketentuan ini. Anda juga dapat menghapus akun Anda kapan saja.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Perubahan Syarat dan Ketentuan</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kami dapat memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan akan
                diberitahukan melalui email atau notifikasi di platform. Penggunaan berkelanjutan
                layanan Anda menandakan penerimaan perubahan tersebut.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Hubungi Kami</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> legal@portalpesantren.id</p>
                <p><strong>WhatsApp:</strong> +62 812-3456-7890</p>
                <p><strong>Alamat:</strong> Jl. Pendidikan No. 123, Jakarta 12345</p>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="pt-6 border-t flex flex-col sm:flex-row gap-3">
              <Button onClick={() => navigate('/register')} className="w-full sm:w-auto">
                Saya Setuju - Daftar Sekarang
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full sm:w-auto">
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage;