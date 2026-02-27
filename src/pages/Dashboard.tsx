import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { mockEvents, categories } from "@/lib/mock-events";
import { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, LogOut, Search, Import, CalendarDays, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const statusColors: Record<Event["status"], string> = {
  new: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  updated: "bg-blue-500/15 text-blue-700 border-blue-200",
  inactive: "bg-muted text-muted-foreground border-border",
  imported: "bg-purple-500/15 text-purple-700 border-purple-200",
};

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("Sydney");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [importNotes, setImportNotes] = useState("");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchesCity = e.city.toLowerCase() === cityFilter.toLowerCase();
      const matchesCat = categoryFilter === "All" || e.category === categoryFilter;
      return matchesSearch && matchesCity && matchesCat;
    });
  }, [events, search, cityFilter, categoryFilter]);

  const handleImport = (event: Event) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? {
              ...e,
              status: "imported" as const,
              importedAt: new Date().toISOString(),
              importedBy: user?.email || "admin",
              importNotes: importNotes,
            }
          : e
      )
    );
    toast({
      title: "Event Imported ✅",
      description: `"${event.title}" has been imported to the platform.`,
    });
    setImportNotes("");
    setSheetOpen(false);
  };

  const openPreview = (event: Event) => {
    setSelectedEvent(event);
    setSheetOpen(true);
    setImportNotes("");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Sydney<span className="text-primary">Events</span>
            </span>
            <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {user?.avatar}
              </div>
              <span>{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }} className="gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Event Dashboard</h1>
        <p className="text-muted-foreground mb-6">Manage scraped events from across Sydney</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sydney">Sydney</SelectItem>
              <SelectItem value="Melbourne">Melbourne</SelectItem>
              <SelectItem value="Brisbane">Brisbane</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Venue</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No events found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((event) => (
                  <TableRow
                    key={event.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => openPreview(event)}
                  >
                    <TableCell className="font-medium max-w-[200px] truncate">{event.title}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm truncate max-w-[180px]">
                      {event.venue}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">{event.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[event.status]} text-xs capitalize`}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 text-xs"
                        disabled={event.status === "imported"}
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreview(event);
                        }}
                      >
                        <Import className="h-3.5 w-3.5" />
                        {event.status === "imported" ? "Imported" : "Import"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Showing {filtered.length} of {events.length} events
        </p>
      </main>

      {/* Preview Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {selectedEvent && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl">{selectedEvent.title}</SheetTitle>
                <SheetDescription>Event details and import options</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="flex gap-2 flex-wrap">
                  <Badge className={`${statusColors[selectedEvent.status]} capitalize`}>
                    {selectedEvent.status}
                  </Badge>
                  <Badge variant="outline">{selectedEvent.category}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    {format(new Date(selectedEvent.date), "EEEE, MMMM d, yyyy")} · {selectedEvent.time}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selectedEvent.venue}, {selectedEvent.address}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <a href={selectedEvent.originalUrl} target="_blank" rel="noopener noreferrer" className="underline">
                      {selectedEvent.sourceWebsite}
                    </a>
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{selectedEvent.description}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedEvent.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last scraped: {format(new Date(selectedEvent.lastScraped), "PPp")}
                </p>

                {selectedEvent.status === "imported" ? (
                  <div className="rounded-lg bg-purple-500/10 border border-purple-200 p-4 text-sm">
                    <p className="font-medium text-purple-700 mb-1">Already Imported</p>
                    <p className="text-muted-foreground">
                      By {selectedEvent.importedBy} on{" "}
                      {selectedEvent.importedAt && format(new Date(selectedEvent.importedAt), "PPp")}
                    </p>
                    {selectedEvent.importNotes && (
                      <p className="mt-1 text-muted-foreground">Notes: {selectedEvent.importNotes}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <Label htmlFor="import-notes">Import Notes (optional)</Label>
                    <Textarea
                      id="import-notes"
                      placeholder="Add any notes about this import..."
                      value={importNotes}
                      onChange={(e) => setImportNotes(e.target.value)}
                    />
                    <Button className="w-full gap-2 font-semibold" onClick={() => handleImport(selectedEvent)}>
                      <Import className="h-4 w-4" />
                      Import to Platform
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Dashboard;
