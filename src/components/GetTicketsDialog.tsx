import { useState } from "react";
import { Event } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Props {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GetTicketsDialog = ({ event, open, onOpenChange }: Props) => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;

    toast({
      title: "You're all set! 🎉",
      description: `Redirecting to ${event?.sourceWebsite} for tickets...`,
    });

    setTimeout(() => {
      window.open(event?.originalUrl, "_blank");
      onOpenChange(false);
      setEmail("");
      setConsent(false);
    }, 1200);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Get Tickets</DialogTitle>
          <DialogDescription>
            Enter your email to proceed to <strong>{event.title}</strong> tickets.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="ticket-email">Email address</Label>
            <Input
              id="ticket-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
            />
            <Label htmlFor="consent" className="text-sm text-muted-foreground leading-snug">
              I agree to receive event updates and promotional emails. You can unsubscribe anytime.
            </Label>
          </div>
          <Button type="submit" className="w-full font-semibold" disabled={!email || !consent}>
            Continue to Tickets
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GetTicketsDialog;
