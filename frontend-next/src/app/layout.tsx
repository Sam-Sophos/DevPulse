import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "DevPulse",
  description: "Track developer activity and growth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ padding: "1.5rem" }}>{children}</main>
      </body>
    </html>
  );
}
