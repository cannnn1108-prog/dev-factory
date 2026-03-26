import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="lg:ml-64 min-h-screen p-4 pt-16 lg:p-8">
        {children}
      </main>
    </>
  );
}
