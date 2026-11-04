-- ====================================================================
-- EJECUTA ESTO EN EL SQL EDITOR DE SUPABASE PARA DAR PERMISO TOTAL
-- ====================================================================

-- 1. Asegurar que las tablas existan
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar_id INTEGER DEFAULT 1 CHECK (avatar_id BETWEEN 1 AND 10),
    has_seen_intro BOOLEAN DEFAULT FALSE,
    puntos_totales INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.puntajes_minijuegos (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    juego_id TEXT NOT NULL,
    nivel INTEGER NOT NULL,
    puntaje INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Conceder permisos de lectura y escritura al rol anon y authenticated
GRANT ALL ON TABLE public.usuarios TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.puntajes_minijuegos TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 3. Habilitar RLS con política permisiva pública
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puntajes_minijuegos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "permitir_todo_usuarios" ON public.usuarios;
CREATE POLICY "permitir_todo_usuarios" ON public.usuarios FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "permitir_todo_puntajes" ON public.puntajes_minijuegos;
CREATE POLICY "permitir_todo_puntajes" ON public.puntajes_minijuegos FOR ALL TO public USING (true) WITH CHECK (true);

