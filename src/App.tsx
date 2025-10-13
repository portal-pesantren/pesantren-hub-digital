import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/DashboardLayout";
import { RoleProvider } from "./contexts/RoleContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<DashboardLayout><ProfilePage /></DashboardLayout>} />
          <Route path="/people" element={<DashboardLayout><PeoplePage /></DashboardLayout>} />
          <Route path="/events" element={<DashboardLayout><EventsPage /></DashboardLayout>} />
          <Route path="/news" element={<DashboardLayout><NewsPage /></DashboardLayout>} />
          <Route path="/gallery" element={<DashboardLayout><GalleryPage /></DashboardLayout>} />
          <Route path="/stats" element={<DashboardLayout><StatisticsPage /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
          {/* Super admin routes */}
          <Route path="/manage-pondok" element={<DashboardLayout><ManagePondokPage /></DashboardLayout>} />
          <Route path="/manage-pondok/:id" element={<DashboardLayout><PondokProfilePage /></DashboardLayout>} />
          <Route path="/verification" element={<DashboardLayout><VerificationPage /></DashboardLayout>} />
          <Route path="/notifications" element={<DashboardLayout><NotificationsPage /></DashboardLayout>} />
          <Route path="/moderation" element={<DashboardLayout><ModerationPage /></DashboardLayout>} />
          <Route path="/backup" element={<DashboardLayout><BackupPage /></DashboardLayout>} />
          <Route path="/global-insights" element={<DashboardLayout><GlobalInsightsPage /></DashboardLayout>} />
          <Route path="/portal-settings" element={<DashboardLayout><PortalSettingsPage /></DashboardLayout>} />
          <Route path="/branding" element={<DashboardLayout><BrandingPage /></DashboardLayout>} />
          <Route path="/activity-logs" element={<DashboardLayout><ActivityLogsPage /></DashboardLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </RoleProvider>
  </QueryClientProvider>
);

export default App;
