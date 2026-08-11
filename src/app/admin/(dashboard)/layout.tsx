import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
