import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { RoleProvider } from "./contexts/RoleContext";
import AppWithErrorBoundary from "./AppWithErrorBoundary";
import { ProfilePage } from "./pages/pondok/ProfilePage";
import { PeoplePage } from "./pages/pondok/PeoplePage";
import { EventsPage } from "./pages/pondok/EventsPage";
import { NewsPage } from "./pages/pondok/NewsPage";
import { GalleryPage } from "./pages/pondok/GalleryPage";
import { StatisticsPage } from "./pages/pondok/StatisticsPage";
// Super admin pages
import { ManagePondokPage } from "./pages/super/ManagePondokPage";
import { PondokProfilePage } from "./pages/super/PondokProfilePage";
import { VerificationPage } from "./pages/super/VerificationPage";
import { NotificationsPage } from "./pages/super/NotificationsPage";
import { ModerationPage } from "./pages/super/ModerationPage";
import { BackupPage } from "./pages/super/BackupPage";
import { GlobalInsightsPage } from "./pages/super/GlobalInsightsPage";
import { PortalSettingsPage } from "./pages/super/PortalSettingsPage";
import { BrandingPage } from "./pages/super/BrandingPage";
import { ActivityLogsPage } from "./pages/super/ActivityLogsPage";
import { SettingsPage } from "./pages/pondok/SettingsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppWithErrorBoundary>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Protected routes - require authentication */}
            <Route path="/" element={
              <ProtectedRoute>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><Index /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><ProfilePage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/people" element={
              <ProtectedRoute>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><PeoplePage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/events" element={
              <ProtectedRoute>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><EventsPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/news" element={
              <ProtectedRoute>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><NewsPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/gallery" element={
              <ProtectedRoute>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><GalleryPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/stats" element={
              <ProtectedRoute>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><StatisticsPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><SettingsPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            {/* Super admin routes - require super admin role */}
            <Route path="/super" element={
              <ProtectedRoute requireSuperAdmin>
                <Navigate to="/global-insights" replace />
              </ProtectedRoute>
            } />

            <Route path="/manage-pondok" element={
              <ProtectedRoute requireSuperAdmin>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><ManagePondokPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/manage-pondok/:id" element={
              <ProtectedRoute requireSuperAdmin>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><PondokProfilePage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/verification" element={
              <ProtectedRoute requireAdmin>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><VerificationPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/notifications" element={
              <ProtectedRoute requireAdmin>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><NotificationsPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/moderation" element={
              <ProtectedRoute requireAdmin>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><ModerationPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/backup" element={
              <ProtectedRoute requireSuperAdmin>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><BackupPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/global-insights" element={
              <ProtectedRoute requireSuperAdmin>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><GlobalInsightsPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/portal-settings" element={
              <ProtectedRoute requireSuperAdmin>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><PortalSettingsPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/branding" element={
              <ProtectedRoute requireSuperAdmin>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><BrandingPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            <Route path="/activity-logs" element={
              <ProtectedRoute requireSuperAdmin>
                <AuthProvider>
                  <RoleProvider>
                    <DashboardLayout><ActivityLogsPage /></DashboardLayout>
                  </RoleProvider>
                </AuthProvider>
              </ProtectedRoute>
            } />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppWithErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
