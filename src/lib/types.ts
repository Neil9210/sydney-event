export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  sourceWebsite: string;
  originalUrl: string;
  lastScraped: string;
  status: "new" | "updated" | "inactive" | "imported";
  importedAt?: string;
  importedBy?: string;
  importNotes?: string;
}

export interface MockUser {
  name: string;
  email: string;
  avatar: string;
}
