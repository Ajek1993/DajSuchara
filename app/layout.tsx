// app/layout.tsx
export const metadata = {
  title: "Suchary",
  description: "Minimal Next.js + Supabase",
};

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body style={{ fontFamily: "system-ui", margin: 0, padding: 24 }}>
        {children}
      </body>
    </html>
  );
}
