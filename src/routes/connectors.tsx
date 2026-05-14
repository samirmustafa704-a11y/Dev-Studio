import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader, PageContainer, TabNav, SplitLayout } from "@/components/layout";
import { Users, Building2, Briefcase } from "lucide-react";
import { z } from "zod";

const connectorsSearchSchema = z.object({
  tab: z.string().optional(),
});

export const Route = createFileRoute("/connectors")({
  validateSearch: connectorsSearchSchema,
  head: () => ({
    meta: [{ title: "Connectors — Dev Studio" }],
  }),
  component: ConnectorsPage,
});

import { ConnectorsSidebar, type Connector } from "@/components/connectors/connectors-sidebar";
import { ConnectorEditor } from "@/components/connectors/connector-editor";

const CONNECTORS_TABS = [
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "hr", label: "HR Contacts", icon: Briefcase },
  { id: "clients", label: "Clients", icon: Users },
];

const INITIAL_CONNECTORS: Connector[] = [
  { id: "1", type: "companies", name: "TechNova Inc.", email: "contact@technova.com", phone: "+1 234 567 8900", notes: "Looking to hire in Q3.", updatedAt: "2 days ago" },
  { id: "2", type: "hr", name: "Sarah Jenkins", email: "sarah.j@example.com", phone: "+1 555 123 4567", notes: "Met at Tech Conference 2024.", updatedAt: "1 week ago" },
  { id: "3", type: "clients", name: "Acme Corp", email: "projects@acme.com", phone: "+44 20 7946 0958", notes: "Interested in a frontend revamp.", updatedAt: "Just now" },
];

function ConnectorsPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const tab = search.tab || "companies";

  const [connectors, setConnectors] = useState<Connector[]>(INITIAL_CONNECTORS);
  const [activeConnectorId, setActiveConnectorId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("dev-studio-connectors");
    if (saved) {
      try {
        setConnectors(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse connectors", e);
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("dev-studio-connectors", JSON.stringify(connectors));
  }, [connectors]);

  // Switch active connector when tab changes
  useEffect(() => {
    const tabConnectors = connectors.filter(c => c.type === tab);
    if (tabConnectors.length > 0 && !tabConnectors.some(c => c.id === activeConnectorId)) {
      setActiveConnectorId(tabConnectors[0].id);
    } else if (tabConnectors.length === 0) {
      setActiveConnectorId(null);
    }
  }, [tab, connectors, activeConnectorId]);

  const handleNewConnector = () => {
    const newConnector: Connector = {
      id: Date.now().toString(),
      type: tab,
      name: "",
      email: "",
      phone: "",
      notes: "",
      updatedAt: "Just now",
    };
    setConnectors([newConnector, ...connectors]);
    setActiveConnectorId(newConnector.id);
  };

  const handleUpdateConnector = (updates: Partial<Connector>) => {
    setConnectors(prev => prev.map(c => 
      c.id === activeConnectorId ? { ...c, ...updates, updatedAt: "Just now" } : c
    ));
  };

  const handleDeleteConnector = (id: string) => {
    setConnectors(prev => prev.filter(c => c.id !== id));
    if (activeConnectorId === id) {
      setActiveConnectorId(null);
    }
  };

  const activeConnector = connectors.find(c => c.id === activeConnectorId) || null;

  return (
    <PageContainer>
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto w-full">
          <PageHeader 
            title="Connectors"
            description="Manage your professional network, clients, and company contacts."
            className="mb-6"
          />
          <div className="w-full overflow-hidden">
            <TabNav 
              tabs={CONNECTORS_TABS.map((t) => ({
                ...t,
                onClick: () => navigate({ to: ".", search: { tab: t.id } })
              }))} 
              activeTab={tab} 
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <SplitLayout 
          sidebar={
            <ConnectorsSidebar 
              type={tab}
              connectors={connectors}
              activeConnectorId={activeConnectorId}
              onSelectConnector={setActiveConnectorId}
              onNewConnector={handleNewConnector}
              onDeleteConnector={handleDeleteConnector}
            />
          } 
          sidebarWidth="lg:w-[260px]" 
          className="border-t border-border"
        >
          <div className="overflow-y-auto scrollbar-thin h-full w-full">
            <ConnectorEditor 
              type={tab}
              activeConnector={activeConnector}
              onUpdateConnector={handleUpdateConnector}
              onSave={() => console.log("Saved!", activeConnector)}
            />
          </div>
        </SplitLayout>
      </div>
    </PageContainer>
  );
}
