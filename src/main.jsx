import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider } from "./contexts/AuthContext"
import { TransactionProvider } from "./contexts/TransactionContext"
import { BudgetProvider } from "./contexts/BudgetContext"
import { Toaster } from "./components/ui/toaster"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <TransactionProvider>
          <BudgetProvider>
            <App />
            <Toaster />
          </BudgetProvider>
        </TransactionProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
