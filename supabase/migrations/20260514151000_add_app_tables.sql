-- DEEP PERSISTENCE LAYER FOR DEV STUDIO
-- Consolidated Migration: Prompts, Agents, Components, Snippets, Connectors, Social, Mails, Interviews, Progress

-- 1. HELPERS
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. TABLES
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    body TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',
    model TEXT,
    favorite BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    versions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    system_prompt TEXT NOT NULL,
    tools TEXT[] DEFAULT '{}',
    model TEXT,
    temperature FLOAT DEFAULT 0.7,
    status TEXT CHECK (status IN ('active', 'idle', 'draft')) DEFAULT 'draft',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    code TEXT NOT NULL,
    dependencies TEXT[] DEFAULT '{}',
    favorite BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    stack TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    structure TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.snippets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    language TEXT NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.connectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('companies', 'hr', 'clients')),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.social_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'twitter', 'instagram')),
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mail_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('cover-letter', 'gmail', 'whatsapp')),
    subject TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    domain TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_global BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    area_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, item_id)
);

-- 3. RLS
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mail_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES
CREATE POLICY "prompts_owner" ON public.prompts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "agents_owner" ON public.agents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "components_owner" ON public.components FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "templates_owner" ON public.templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "snippets_owner" ON public.snippets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "connectors_owner" ON public.connectors FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "social_owner" ON public.social_drafts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "mails_owner" ON public.mail_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "progress_owner" ON public.user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "interview_shared" ON public.interview_questions FOR SELECT USING (is_global = true OR auth.uid() = user_id);
CREATE POLICY "interview_owner" ON public.interview_questions FOR ALL USING (auth.uid() = user_id);

-- 5. TRIGGERS
CREATE TRIGGER tr_prompts_upd BEFORE UPDATE ON public.prompts FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER tr_agents_upd BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER tr_components_upd BEFORE UPDATE ON public.components FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER tr_templates_upd BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER tr_snippets_upd BEFORE UPDATE ON public.snippets FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER tr_connectors_upd BEFORE UPDATE ON public.connectors FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER tr_social_upd BEFORE UPDATE ON public.social_drafts FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER tr_mails_upd BEFORE UPDATE ON public.mail_templates FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
