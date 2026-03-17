import { useEffect, useState } from "react";
import { requestsApi, ExchangeRequest } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import RequestCard from "@/components/RequestCard";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RequestsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestsApi.getAll().then((r) => { setRequests(r); setLoading(false); });
  }, []);

  const handleAccept = async (id: string) => {
    await requestsApi.updateStatus(id, "accepted");
    setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: "accepted" as const } : r)));
    toast({ title: "Request accepted!" });
  };

  const handleReject = async (id: string) => {
    await requestsApi.updateStatus(id, "rejected");
    setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: "rejected" as const } : r)));
    toast({ title: "Request rejected" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Exchange Requests</h1>
        <p className="text-muted-foreground mt-1">Manage your incoming and outgoing requests</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((r) => (
            <RequestCard key={r._id} request={r} currentUserId={user?._id || ""} onAccept={handleAccept} onReject={handleReject} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-20">No requests yet. Search for users to propose an exchange!</p>
      )}
    </div>
  );
};

export default RequestsPage;
