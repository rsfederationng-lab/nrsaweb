import { useQuery } from "@tanstack/react-query";
import { type Subscriber } from "@shared/schema";
import { Loader2, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";

export default function AdminSubscribers() {
  const [search, setSearch] = useState("");

  const { data: subscribers, isLoading, isError, error } = useQuery<Subscriber[]>({
    queryKey: ["/api/subscribers"],
  });

  const filteredSubscribers = subscribers?.filter(sub => 
    sub.email.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleExportCSV = () => {
    if (!filteredSubscribers.length) return;

    const headers = ["Email", "Status", "Subscribed Date"];
    const csvContent = [
      headers.join(","),
      ...filteredSubscribers.map(sub => 
        `"${sub.email}","${sub.isActive ? 'Active' : 'Inactive'}","${format(new Date(sub.createdAt), 'MMM dd, yyyy HH:mm')}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `nrsa_subscribers_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#009739]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center text-destructive">
        Unable to load subscribers: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#009739] to-green-600">Newsletter Subscribers</h1>
          <p className="text-gray-500 mt-1">Manage and export your email subscribers</p>
        </div>
        <Button onClick={handleExportCSV} className="bg-[#009739] hover:bg-[#007a2e] text-white">
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search subscribers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {sub.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{sub.email}</td>
                    <td className="px-6 py-4 text-gray-500">{format(new Date(sub.createdAt), 'MMM dd, yyyy h:mm a')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
