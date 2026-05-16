import type { Database } from "./types";

type MockAuth = {
  getUser: () => Promise<{ data: { user: null }; error: null }>;
  getSession: () => Promise<{ data: { session: null }; error: null }>;
  onAuthStateChange: (_event: string, _callback: unknown) => { data: { subscription: { unsubscribe: () => void } } };
  signUp: (_opts: unknown) => Promise<{ error: null }>;
  signInWithPassword: (_opts: unknown) => Promise<{ error: null }>;
  signInWithOAuth: (_opts: unknown) => Promise<{ error: null }>;
  signOut: () => Promise<{ error: null }>;
  resetPasswordForEmail: (_email: string, _opts: unknown) => Promise<{ error: null }>;
  updateUser: (_opts: unknown) => Promise<{ error: null }>;
};

type MockFrom = {
  select: (_cols?: string) => MockFrom;
  eq: (_col: string, _val: unknown) => MockFrom;
  maybeSingle: () => Promise<{ data: null; error: null }>;
  single: () => Promise<{ data: null; error: null }>;
  update: (_data: unknown) => MockFrom;
  upsert: (_data: unknown) => MockFrom;
  insert: (_data: unknown) => MockFrom;
};

type MockClient = {
  auth: MockAuth;
  from: (_table: string) => MockFrom;
};

function buildMock(): MockClient {
  const chain: MockFrom = {
    select: () => chain,
    eq: () => chain,
    maybeSingle: async () => ({ data: null, error: null }),
    single: async () => ({ data: null, error: null }),
    update: () => chain,
    upsert: () => chain,
    insert: () => chain,
  };

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (_e, _cb) => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async (_opts) => ({ error: null }),
      signInWithPassword: async (_opts) => ({ error: null }),
      signInWithOAuth: async (_opts) => ({ error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async (_email, _opts) => ({ error: null }),
      updateUser: async (_opts) => ({ error: null }),
    },
    from: (_table: string) => chain,
  };
}

export const supabase = buildMock() as unknown as ReturnType<typeof import("@supabase/supabase-js").createClient<Database>>;
