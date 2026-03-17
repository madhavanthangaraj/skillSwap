import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usersApi, skillsApi, requestsApi, sessionsApi, User, Skill, ExchangeRequest, Session } from "@/services/api";
import UserCard from "@/components/UserCard";
import SkillCard from "@/components/SkillCard";
import { ArrowRightLeft, BookOpen, Users, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<User[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [m, s, r, ss] = await Promise.all([
        usersApi.getMatches(),
        skillsApi.getAll(),
        requestsApi.getAll(),
        sessionsApi.getAll(),
      ]);
      setMatches(m);
      setSkills(s);
      setRequests(r);
      setSessions(ss);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { icon: BookOpen, label: "Skills Listed", value: skills.length, color: "bg-primary/10 text-primary" },
    { icon: Users, label: "Matches", value: matches.length, color: "bg-accent/10 text-accent" },
    { icon: ArrowRightLeft, label: "Requests", value: requests.length, color: "bg-warning/10 text-warning" },
    { icon: Calendar, label: "Sessions", value: sessions.length, color: "bg-success/10 text-success" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening on SkillSwap</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Matched Users</h2>
          <Link to="/search" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.slice(0, 3).map((u) => (
            <UserCard key={u._id} user={u} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Latest Skills</h2>
          <Link to="/skills" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.slice(0, 4).map((s) => (
            <SkillCard key={s._id} skill={s} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
