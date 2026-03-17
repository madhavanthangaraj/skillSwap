import { User } from "@/services/api";
import { Star, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserCardProps {
  user: User;
  onExchange?: (user: User) => void;
}

const UserCard = ({ user, onExchange }: UserCardProps) => {
  return (
    <div className="glass-card rounded-xl p-5 hover-lift">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground truncate">{user.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            <span className="text-sm text-muted-foreground">{user.rating} ({user.reviewCount} reviews)</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{user.bio}</p>
      <div className="mb-3">
        <p className="text-xs font-medium text-foreground mb-1">Offers:</p>
        <div className="flex flex-wrap gap-1">
          {user.skillsOffered.map((s) => (
            <span key={s._id} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s.name}</span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-xs font-medium text-foreground mb-1">Wants:</p>
        <div className="flex flex-wrap gap-1">
          {user.skillsWanted.map((s) => (
            <span key={s} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      </div>
      {onExchange && (
        <Button onClick={() => onExchange(user)} className="w-full gradient-primary text-primary-foreground" size="sm">
          <ArrowRightLeft className="w-4 h-4 mr-1" /> Propose Exchange
        </Button>
      )}
    </div>
  );
};

export default UserCard;
