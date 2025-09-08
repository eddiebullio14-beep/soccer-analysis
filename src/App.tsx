import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import { Dashboard } from "./pages/Dashboard";
import { VideoUpload } from "./pages/VideoUpload";
import { VideoAnalysis } from "./pages/VideoAnalysis";
import { TacticalBoard } from "./pages/TacticalBoard";
import { Auth } from "./pages/Auth";
import { useAuth } from "./hooks/useAuth";
import { Loader2 } from "lucide-react";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-field flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 overflow-hidden">
                    <header className="h-14 flex items-center border-b border-border/50 bg-card/50 backdrop-blur px-4">
                      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                    </header>
                    <div className="flex-1 overflow-y-auto">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/upload" element={<VideoUpload />} />
                        <Route path="/analysis/:gameId" element={<VideoAnalysis />} />
                        <Route path="/tactical/:gameId" element={<TacticalBoard />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
