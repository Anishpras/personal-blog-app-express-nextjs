import { AuthProvider } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
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
        <AuthProvider>
          <Navbar />
          <MantineProvider>
            <main>{children}</main>
          </MantineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
