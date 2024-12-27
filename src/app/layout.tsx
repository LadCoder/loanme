import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCProvider } from "./_trpc/Provider";
import { ThemeProvider } from "~/app/_components/theme-provider";
import { Toaster } from "~/app/_components/ui/toaster";
import { AppSidebar } from "~/app/_components/nav/AppSidebar";
import { Header } from "~/app/_components/nav/Header";

import {
  SidebarInset,
  SidebarProvider,
} from "~/app/_components/ui/sidebar"

export const metadata: Metadata = {
  title: "LoanMe - Personal Loan Management",
  description: "Track and manage personal loans with friends and family",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
        <body className="min-h-screen bg-background font-sans antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <Header />
                  <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
              <Toaster />
            </TRPCProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
