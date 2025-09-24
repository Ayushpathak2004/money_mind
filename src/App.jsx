// src/App.jsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { BudgetProvider } from "@/contexts/BudgetContext";
import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRouter";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions"; 
import Analytics from "./pages/Analytics";
import Budget from "./pages/Budget";
import Settings from "./pages/Settings";
import Premium from "./pages/Premium";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="expense-tracker-theme">
      <AuthProvider>
        <TransactionProvider>
          <BudgetProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/budget" element={<Budget />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/premium" element={<Premium />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </BudgetProvider>
        </TransactionProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
