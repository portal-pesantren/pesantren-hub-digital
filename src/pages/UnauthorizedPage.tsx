import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Home, LogOut } from 'lucide-react';
import { useAuth, useRole } from '@/contexts/AuthContext';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isSuperAdmin, isAdmin, isParent } = useRole();

  const message = location.state?.message || 'Anda tidak memiliki akses ke halaman ini';

  const getRoleBadge = () => {
    if (isSuperAdmin()) return { label: 'Super Admin', color: 'bg-purple-100 text-purple-800' };
    if (isAdmin()) return { label: 'Admin', color: 'bg-blue-100 text-blue-800' };
    if (isParent()) return { label: 'Orang Tua', color: 'bg-green-100 text-green-800' };
    return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
  };

  const roleBadge = getRoleBadge();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleGoBack = () => {
    if (location.state?.from) {
      navigate(location.state.from.pathname);
    } else {
      navigate(-1);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToLogin = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Akses Ditolak
            </CardTitle>
            <CardDescription>
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {user && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <span className="text-sm text-gray-900">{user.email}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Nama:</span>
                  <span className="text-sm text-gray-900">{user.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Role:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadge.color}`}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Halaman Sebelumnya
              </Button>

              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Menu Utama
              </Button>

              {user ? (
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar dan Ganti Akun
                </Button>
              ) : (
                <Button
                  onClick={handleGoToLogin}
                  className="w-full"
                >
                  Masuk dengan Akun Lain
                </Button>
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">
                Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator sistem.
              </p>
              <div className="text-xs text-gray-400">
                <p>Hubungi: support@portalpesantren.id</p>
                <p>WhatsApp: +62 812-3456-7890</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}