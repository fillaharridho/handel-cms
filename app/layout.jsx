import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Portal Desa Harmoni",
  description: "Website Resmi Desa Harmoni Kabupaten Banyuwangi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {/* Navbar akan muncul di semua halaman */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}