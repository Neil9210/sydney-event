import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { mockEvents, categories } from "@/lib/mock-events";
import { Event } from "@/lib/types";
import EventCard from "@/components/EventCard";
import GetTicketsDialog from "@/components/GetTicketsDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [ticketEvent, setTicketEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const filtered = useMemo(() => {
    return mockEvents.filter((e) => {
      const matchesSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || e.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const handleGetTickets = (event: Event) => {
    setTicketEvent(event);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Sydney<span className="text-primary">Events</span>
            </span>
          </div>
          <Link to={isAuthenticated ? "/dashboard" : "/login"}>
            <Button variant="outline" size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              {isAuthenticated ? "Dashboard" : "Admin Login"}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/6" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
              ✨ Discover what's happening
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
              Events in{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sydney
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              Concerts, festivals, food markets, art exhibitions, and more — all in one place.
              Find your next unforgettable experience.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search events, venues, or keywords..."
                className="h-12 pl-12 pr-4 text-base rounded-full border-border/80 bg-card shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-4 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              className="shrink-0 rounded-full"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* Events Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{filtered.length}</strong> events
          </p>
        </div>
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">No events found matching your criteria.</p>
            <Button variant="link" onClick={() => { setSearch(""); setActiveCategory("All"); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {filtered.map((event) => (
              <motion.div
                key={event.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <EventCard event={event} onGetTickets={handleGetTickets} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 text-center text-sm text-muted-foreground">
          <p>© 2026 SydneyEvents · Built as a Full-Stack Assignment Demo</p>
        </div>
      </footer>

      <GetTicketsDialog event={ticketEvent} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default Index;
