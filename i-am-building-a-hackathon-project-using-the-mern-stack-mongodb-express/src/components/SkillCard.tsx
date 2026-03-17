import { Skill } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

const levelColors: Record<string, string> = {
  beginner: "bg-success/10 text-success border-success/20",
  intermediate: "bg-warning/10 text-warning border-warning/20",
  advanced: "bg-primary/10 text-primary border-primary/20",
};

const SkillCard = ({ skill }: { skill: Skill }) => {
  return (
    <div className="glass-card rounded-xl p-5 hover-lift">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <Badge variant="outline" className={levelColors[skill.level]}>
          {skill.level}
        </Badge>
      </div>
      <h3 className="font-display font-semibold text-foreground text-lg">{skill.name}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-3">{skill.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{skill.category}</span>
        <span className="text-xs text-muted-foreground">by {skill.userName}</span>
      </div>
    </div>
  );
};

export default SkillCard;
