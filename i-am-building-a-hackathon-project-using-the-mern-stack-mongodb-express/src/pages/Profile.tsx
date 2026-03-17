import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { skillsApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SkillCard from "@/components/SkillCard";
import { Plus, User as UserIcon, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [skillForm, setSkillForm] = useState({ name: "", category: "Programming", level: "intermediate" as const, description: "" });

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await skillsApi.add(skillForm);
      refreshUser();
      setShowAddSkill(false);
      setSkillForm({ name: "", category: "Programming", level: "intermediate", description: "" });
      toast({ title: "Skill added!" });
    } catch {
      toast({ title: "Error", description: "Failed to add skill", variant: "destructive" });
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="glass-card rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-3xl">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span className="text-sm text-muted-foreground">{user.rating || "No"} rating · {user.reviewCount} reviews</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{user.bio || "No bio yet"}</p>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Member</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Skills Offered</h2>
          <Button size="sm" onClick={() => setShowAddSkill(!showAddSkill)} variant={showAddSkill ? "outline" : "default"} className={!showAddSkill ? "gradient-primary text-primary-foreground" : ""}>
            <Plus className="w-4 h-4 mr-1" /> Add Skill
          </Button>
        </div>

        {showAddSkill && (
          <form onSubmit={handleAddSkill} className="glass-card rounded-xl p-5 mb-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Skill Name</Label>
                <Input value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="e.g. React.js" required />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={skillForm.category} onValueChange={(v) => setSkillForm({ ...skillForm, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                    <SelectItem value="Language">Language</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Level</Label>
                <Select value={skillForm.level} onValueChange={(v) => setSkillForm({ ...skillForm, level: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={skillForm.description} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} placeholder="Brief description..." rows={2} />
            </div>
            <Button type="submit" className="gradient-primary text-primary-foreground">Save Skill</Button>
          </form>
        )}

        {user.skillsOffered.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {user.skillsOffered.map((s) => (
              <SkillCard key={s._id} skill={s} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-8">No skills added yet. Add your first skill above!</p>
        )}
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Skills Wanted</h2>
        {user.skillsWanted.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted.map((s) => (
              <span key={s} className="bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-medium">{s}</span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-8">No skills wanted listed yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
