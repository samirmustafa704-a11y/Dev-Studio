import { useState, useMemo } from "react";
import { Search, ChevronRight, Sparkles, Globe, Server, Database, Container, Layout, Cpu } from "lucide-react";
import { SplitLayout } from "../layout";
import { Input } from "@/components/ui/input";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const DOMAINS = [
  { id: "frontend", label: "Frontend", icon: Globe },
  { id: "backend", label: "Backend", icon: Server },
  { id: "database", label: "Database", icon: Database },
  { id: "devops", label: "DevOps", icon: Container },
  { id: "architecture", label: "Architecture", icon: Layout },
  { id: "core", label: "Core CS", icon: Cpu },
];

const QUESTIONS = [
  {
    id: "1",
    question: "What is the Virtual DOM and how does it work in React?",
    answer: "The Virtual DOM is a lightweight copy of the real DOM. React uses it to improve performance by calculating the minimal number of changes needed to update the UI (diffing) and then applying those changes in a single batch (reconciliation).",
    difficulty: "medium",
    domain: "frontend",
    tags: ["react", "javascript"]
  },
  {
    id: "2",
    question: "Explain the difference between SQL and NoSQL databases.",
    answer: "SQL databases are relational, table-based, and have predefined schemas (e.g., PostgreSQL). NoSQL databases are non-relational, document or key-value based, and have dynamic schemas (e.g., MongoDB). SQL is better for structured data and complex queries, while NoSQL is better for scalability and hierarchical data.",
    difficulty: "easy",
    domain: "database",
    tags: ["sql", "nosql"]
  },
  {
    id: "3",
    question: "How do you handle race conditions in a distributed system?",
    answer: "Race conditions can be handled using distributed locking (e.g., Redis Redlock), optimistic concurrency control (versioning), or by using idempotent operations and message queues with atomic delivery guarantees.",
    difficulty: "hard",
    domain: "architecture",
    tags: ["distributed-systems", "concurrency"]
  }
];

export function QuestionList() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [domain, setDomain] = useState<string>("frontend");

  const filtered = useMemo(() => {
    return QUESTIONS.filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase()) || 
                          q.answer.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = !difficulty || q.difficulty === difficulty;
      const matchesDomain = q.domain === domain;
      return matchesSearch && matchesDifficulty && matchesDomain;
    });
  }, [search, difficulty, domain]);

  const sidebar = (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-4 border-b border-border space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(difficulty === d ? null : d)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border transition-all ${
                difficulty === d
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-none p-2 space-y-1">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-3 py-2">
          Domains
        </h4>
        {DOMAINS.map((d) => {
          const Icon = d.icon;
          const active = domain === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setDomain(d.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`size-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                {d.label}
              </div>
              {active && <ChevronRight className="size-3.5" />}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <SplitLayout sidebar={sidebar} sidebarWidth="lg:w-[280px]" className="border-t border-border">
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {filtered.length} Questions Found
            </h3>
          </div>
          {filtered.map((q) => (
            <article
              key={q.id}
              className="group rounded-xl border border-border bg-card hover:border-primary/30 transition-all hover:shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider ${
                        q.difficulty === 'hard' ? 'bg-primary/10 text-primary' :
                        q.difficulty === 'medium' ? 'bg-primary/10 text-primary' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {DOMAINS.find(d => d.id === q.domain)?.label}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                      {q.question}
                    </h3>
                  </div>
                  <button className="shrink-0 p-2 rounded-md hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed border border-border/50">
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-wider text-primary/70">
                    <Sparkles className="size-3" /> Sample Answer
                  </div>
                  {q.answer}
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed border-border">
              <Search className="size-10 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-sm text-muted-foreground">No questions found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </SplitLayout>
  );
}
