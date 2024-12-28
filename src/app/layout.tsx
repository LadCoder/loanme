import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "~/app/_components/theme-provider";
import { Toaster } from "~/app/_components/ui/toaster";
import { AppSidebar } from "~/app/_components/nav/AppSidebar";
import { SidebarInset, SidebarProvider } from "./_components/ui/sidebar";
import { Header } from "./_components/nav/Header";

export const metadata = {
  title: "LoanMe",
  description: "Manage your loans with ease",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
