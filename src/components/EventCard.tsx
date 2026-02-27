import { Event } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<Event["status"], string> = {
  new: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  updated: "bg-blue-500/15 text-blue-700 border-blue-200",
  inactive: "bg-muted text-muted-foreground border-border",
  imported: "bg-purple-500/15 text-purple-700 border-purple-200",
};

interface EventCardProps {
  event: Event;
  onGetTickets: (event: Event) => void;
}

const EventCard = ({ event, onGetTickets }: EventCardProps) => {
  return (
    <Card className="group overflow-hidden border-border/60 bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`${statusColors[event.status]} text-xs font-medium capitalize`}>
            {event.status}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-xs">
            {event.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-lg font-bold leading-tight text-card-foreground mb-2 line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>{format(new Date(event.date), "EEE, MMM d, yyyy")} · {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {event.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            {event.sourceWebsite}
          </span>
          <Button
            size="sm"
            className="font-semibold"
            onClick={() => onGetTickets(event)}
          >
            GET TICKETS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
