import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProcessingProvider } from "@/context/ProcessingContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";

// ── Lazy-loaded pages (code-split at build time) ──────────────────
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyFiles = lazy(() => import("./pages/MyFiles"));
const Studio = lazy(() => import("./pages/Studio"));
const History = lazy(() => import("./pages/History"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Billing = lazy(() => import("./pages/Billing"));
const Support = lazy(() => import("./pages/Support"));
const UploadDocument = lazy(() => import("./pages/UploadDocument"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Users = lazy(() => import("./pages/Users"));
const Search = lazy(() => import("./pages/Search"));

// ── Loading fallback for page transitions ─────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,       // 30s — avoid refetching on mount
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
        <ProcessingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><ErrorBoundary pageName="Dashboard"><Dashboard /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/files" element={<ProtectedRoute><ErrorBoundary pageName="MyFiles"><MyFiles /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/studio" element={<ProtectedRoute><ErrorBoundary pageName="Studio"><Studio /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><ErrorBoundary pageName="History"><History /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><ErrorBoundary pageName="Search"><Search /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ErrorBoundary pageName="Profile"><Profile /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><ErrorBoundary pageName="Settings"><Settings /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute><ErrorBoundary pageName="Billing"><Billing /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute><ErrorBoundary pageName="Support"><Support /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute adminOnly><ErrorBoundary pageName="Users"><Users /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><ErrorBoundary pageName="UploadDocument"><UploadDocument /></ErrorBoundary></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
        </ProcessingProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
