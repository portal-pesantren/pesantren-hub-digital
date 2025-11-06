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

            {/* Main dashboard route - no authentication required */}
            <Route path="/" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><Index /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/profile" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><ProfilePage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/people" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><PeoplePage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/events" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><EventsPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/news" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><NewsPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/gallery" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><GalleryPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/stats" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><StatisticsPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/settings" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><SettingsPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            {/* Super admin routes - no authentication required */}
            <Route path="/super" element={
              <AuthProvider>
                <RoleProvider>
                  <Navigate to="/global-insights" replace />
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/manage-pondok" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><ManagePondokPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/manage-pondok/:id" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><PondokProfilePage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/verification" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><VerificationPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/notifications" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><NotificationsPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/moderation" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><ModerationPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/backup" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><BackupPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/global-insights" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><GlobalInsightsPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/portal-settings" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><PortalSettingsPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/branding" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><BrandingPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
            } />

            <Route path="/activity-logs" element={
              <AuthProvider>
                <RoleProvider>
                  <DashboardLayout><ActivityLogsPage /></DashboardLayout>
                </RoleProvider>
              </AuthProvider>
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