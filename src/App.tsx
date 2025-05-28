
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import NAPRARiskAssessment from "./pages/NAPRARiskAssessment";
import SecureNAPRARiskAssessmentPage from "./pages/SecureNAPRARiskAssessment";
import WaitlistAdminPage from "./pages/AdminWaitlist";
import EmailPreviewPage from "./pages/AdminEmails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/waitlist" element={<Index />} />
          <Route path="/napra-assessment" element={<NAPRARiskAssessment />} />
          <Route path="/secure-assessment" element={<SecureNAPRARiskAssessmentPage />} />
          <Route path="/admin" element={<WaitlistAdminPage />} />
          <Route path="/admin/emails" element={<EmailPreviewPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
