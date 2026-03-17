import { useEffect, useState } from "react";
import { sessionsApi, requestsApi, Session, ExchangeRequest } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Loader2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const SchedulePage = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ requestId: "", date: "", time: "", duration: 60 });
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    Promise.all([sessionsApi.getAll(), requestsApi.getAll()]).then(([s, r]) => {
      setSessions(s);
      setRequests(r.filter((req) => req.status === "accepted"));
      setLoading(false);
    });
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduling(true);
    try {
      const session = await sessionsApi.schedule(form);
      setSessions((prev) => [...prev, session]);
      setDialogOpen(false);
      setForm({ requestId: "", date: "", time: "", duration: 60 });
      toast({ title: "Session scheduled!" });
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setScheduling(false);
    }
  };

  const statusStyles: Record<string, string> = {
    scheduled: "bg-primary/10 text-primary border-primary/20",
    completed: "bg-success/10 text-success border-success/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage your exchange sessions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground" disabled={requests.length === 0}>
              <Plus className="w-4 h-4 mr-1" /> Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Schedule a Session</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <Label>Exchange Request</Label>
                <Select value={form.requestId} onValueChange={(v) => setForm({ ...form, requestId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select an accepted request" /></SelectTrigger>
                  <SelectContent>
                    {requests.map((r) => (
                      <SelectItem key={r._id} value={r._id}>{r.skillOffered} ↔ {r.skillWanted}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Select value={String(form.duration)} onValueChange={(v) => setForm({ ...form, duration: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                    <SelectItem value="90">90 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={scheduling || !form.requestId} className="w-full gradient-primary text-primary-foreground">
                {scheduling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Schedule Session
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div key={s._id} className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-foreground">{s.skill}</h3>
                <Badge variant="outline" className={statusStyles[s.status]}>{s.status}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{s.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{s.time}</span>
                <span>{s.duration} min</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {s.fromUser.name} ↔ {s.toUser.name}
                </p>
                <a href={s.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                  <Video className="w-4 h-4" /> Join
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-20">No sessions yet. Accept a request and schedule your first exchange!</p>
      )}
    </div>
  );
};

export default SchedulePage;
