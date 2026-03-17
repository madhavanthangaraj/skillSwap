import { ExchangeRequest } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";

interface RequestCardProps {
  request: ExchangeRequest;
  currentUserId: string;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  accepted: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const RequestCard = ({ request, currentUserId, onAccept, onReject }: RequestCardProps) => {
  const isIncoming = request.toUser._id === currentUserId;
  const otherUser = isIncoming ? request.fromUser : request.toUser;

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold">
            {otherUser.name.charAt(0)}
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">{otherUser.name}</p>
            <p className="text-xs text-muted-foreground">{isIncoming ? "Incoming" : "Outgoing"} request</p>
          </div>
        </div>
        <Badge variant="outline" className={statusStyles[request.status]}>
          {request.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
          {request.status}
        </Badge>
      </div>

      <div className="bg-muted/50 rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{request.skillOffered}</span>
          <span className="text-muted-foreground">↔</span>
          <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs">{request.skillWanted}</span>
        </div>
      </div>

      {request.message && (
        <p className="text-sm text-muted-foreground mb-3 italic">"{request.message}"</p>
      )}

      {isIncoming && request.status === "pending" && (
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 bg-success text-success-foreground hover:bg-success/90" onClick={() => onAccept?.(request._id)}>
            <Check className="w-4 h-4 mr-1" /> Accept
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10" onClick={() => onReject?.(request._id)}>
            <X className="w-4 h-4 mr-1" /> Reject
          </Button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
