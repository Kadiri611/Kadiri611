import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DynamicPage from "./pages/DynamicPage";
import AdminFooter from "./pages/admin/AdminFooter";
import AdminPages from "./pages/admin/AdminPages";
import AdminFAQ from "./pages/admin/AdminFAQ";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminBranding from "./pages/admin/AdminBranding";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrandingProvider>
        <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            {/* Admin routes */}
            <Route path="/admin/footer" element={<AdminFooter />} />
            <Route path="/admin/pages" element={<AdminPages />} />
            <Route path="/admin/faq" element={<AdminFAQ />} />
            <Route path="/admin/packages" element={<AdminPackages />} />
            <Route path="/admin/branding" element={<AdminBranding />} />
            {/* Dynamic pages route - must be before catch-all */}
            <Route path="/page/:slug" element={<DynamicPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
        </TooltipProvider>
      </BrandingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
