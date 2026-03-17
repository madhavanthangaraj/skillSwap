import { Review } from "@/services/api";
import { Star } from "lucide-react";

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-accent-foreground font-display font-bold">
            {review.fromUser.name.charAt(0)}
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">{review.fromUser.name}</p>
            <p className="text-xs text-muted-foreground">reviewed for {review.skill}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < review.rating ? "text-warning fill-warning" : "text-muted"}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
      <p className="text-xs text-muted-foreground mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default ReviewCard;
