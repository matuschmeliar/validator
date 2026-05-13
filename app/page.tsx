import { redirect } from "next/navigation";
import { Dashboard } from "@/components/Dashboard";
import { loadDashboardStats } from "@/lib/stats";
import { readSessionEmail } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const email = await readSessionEmail();
  if (!email) redirect("/login");

  const stats = await loadDashboardStats();
  return <Dashboard stats={stats} myEmail={email} />;
}
