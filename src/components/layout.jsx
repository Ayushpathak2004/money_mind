// src/components/layout.jsx
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r">
          <Sidebar />
        </aside>

        {/* Mobile sidebar (overlay) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            {/* Sidebar panel */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r">
              <Sidebar />
            </aside>

            {/* Overlay background */}
            <div
              className="flex-1 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>
        )}

        {/* Main section */}
        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 p-6 pt-6">
            <div className="max-w-[1400px] w-full mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
