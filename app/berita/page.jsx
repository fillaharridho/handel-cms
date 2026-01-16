import { supabase } from "../../lib/supabase";
import BeritaClient from "./BeritaClient";

export default async function BeritaPage() {
  // Query dilakukan di server - aman dari intipan tab Network
  const { data: listBerita, error } = await supabase
    .from("berita")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error.message);
  }

  return <BeritaClient initialBerita={listBerita || []} />;
}