import { useEffect, useState } from "react";
import { skillsApi, Skill } from "@/services/api";
import SkillCard from "@/components/SkillCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

const SkillListing = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillsApi.getAll().then((s) => { setSkills(s); setLoading(false); });
  }, []);

  const filtered = skills.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Skills Marketplace</h1>
        <p className="text-muted-foreground mt-1">Browse all available skills</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills..."
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((s) => (
            <SkillCard key={s._id} skill={s} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-20">No skills found matching "{search}"</p>
      )}
    </div>
  );
};

export default SkillListing;
