import { Users, Building2, Briefcase, Plus, Trash2 } from "lucide-react";

export interface Connector {
  id: string;
  type: string;
  name: string;
  email?: string;
  phone?: string;
  notes: string;
  updatedAt: string;
}

interface ConnectorsSidebarProps {
  type: string;
  connectors: Connector[];
  activeConnectorId: string | null;
  onSelectConnector: (id: string) => void;
  onNewConnector: () => void;
  onDeleteConnector: (id: string) => void;
}

export function ConnectorsSidebar({ type, connectors, activeConnectorId, onSelectConnector, onNewConnector, onDeleteConnector }: ConnectorsSidebarProps) {
  const typeConnectors = connectors.filter(c => c.type === type);

  return (
    <div className="p-6 h-full flex flex-col min-h-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          {type === "companies" && <Building2 className="size-5" />}
          {type === "hr" && <Briefcase className="size-5" />}
          {type === "clients" && <Users className="size-5" />}
        </div>
        <div>
          <h3 className="text-sm font-semibold capitalize">{type.replace("-", " ")}</h3>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Network
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          Saved Contacts
        </span>
        <button 
          onClick={onNewConnector}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <nav className="space-y-1 overflow-y-auto flex-1 mt-2 pr-2 scrollbar-thin">
        {typeConnectors.length > 0 ? (
          typeConnectors.map(connector => (
            <div
              key={connector.id}
              className={`group relative w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                activeConnectorId === connector.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
              onClick={() => onSelectConnector(connector.id)}
            >
              <div className="pr-6">
                <div className={`truncate ${activeConnectorId === connector.id ? "font-medium" : ""}`}>
                  {connector.name || "Unnamed Contact"}
                </div>
                <div className="truncate text-xs text-muted-foreground mt-0.5">
                  {connector.email || connector.phone || "No contact info"}
                </div>
                <div className="text-[10px] opacity-70 mt-1">{connector.updatedAt}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConnector(connector.id);
                }}
                className="absolute right-2 top-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                title="Delete contact"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="px-3 py-4 text-xs text-muted-foreground border border-dashed border-border rounded-md text-center">
            No contacts yet
          </div>
        )}
      </nav>
    </div>
  );
}
