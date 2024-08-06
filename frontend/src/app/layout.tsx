import { Suspense } from "react";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import { AuthProvider } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import ErrorFallback from "@/components/ErrorFallback";
import { Loading } from "@/components/Loading";
import { Toaster } from "sonner";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ClientErrorBoundary fallback={<ErrorFallback />}>
          <Suspense fallback={<Loading />}>
            <AuthProvider>
              <Navbar />
              <MantineProvider>
                <main>
                  {children}
                  <Toaster />
                </main>
              </MantineProvider>
            </AuthProvider>
          </Suspense>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
