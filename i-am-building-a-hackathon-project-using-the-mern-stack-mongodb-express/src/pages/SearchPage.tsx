import { useEffect, useState } from "react";
import { usersApi, requestsApi, User } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import UserCard from "@/components/UserCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SearchPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [requestForm, setRequestForm] = useState({ skillOffered: "", skillWanted: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    usersApi.getAll().then((u) => {
      setUsers(u.filter((x) => x._id !== user?._id));
      setLoading(false);
    });
  }, [user]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.skillsOffered.some((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSending(true);
    try {
      await requestsApi.send({
        toUserId: selectedUser._id,
        skillOffered: requestForm.skillOffered,
        skillWanted: requestForm.skillWanted,
        message: requestForm.message,
      });
      toast({ title: "Request sent!", description: `Exchange request sent to ${selectedUser.name}` });
      setSelectedUser(null);
      setRequestForm({ skillOffered: "", skillWanted: "", message: "" });
    } catch {
      toast({ title: "Error", description: "Failed to send request", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Find People</h1>
        <p className="text-muted-foreground mt-1">Search users by name or skill</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users or skills..." className="pl-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((u) => (
            <UserCard key={u._id} user={u} onExchange={(u) => setSelectedUser(u)} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-20">No users found.</p>
      )}

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Propose Exchange with {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendRequest} className="space-y-4">
            <div>
              <Label>Skill You Offer</Label>
              <Input value={requestForm.skillOffered} onChange={(e) => setRequestForm({ ...requestForm, skillOffered: e.target.value })} placeholder="e.g. React.js" required />
            </div>
            <div>
              <Label>Skill You Want</Label>
              <Input value={requestForm.skillWanted} onChange={(e) => setRequestForm({ ...requestForm, skillWanted: e.target.value })} placeholder="e.g. UI/UX Design" required />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea value={requestForm.message} onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })} placeholder="Hi! I'd love to exchange..." rows={3} />
            </div>
            <Button type="submit" disabled={sending} className="w-full gradient-primary text-primary-foreground">
              {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Send Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchPage;
