-- ====================================================================
-- ESQUEMA DE BASE DE DATOS SUPABASE - GEOMATRIX: BATALLA ANALÍTICA
-- Autora: Dayami Blanco Ramos
-- CETIS 57 - Geometría Analítica
-- ====================================================================

-- 1. Tabla de Usuarios (Alumnos del plantel)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Texto plano para identificación escolar simple
    avatar_id INTEGER DEFAULT 1 CHECK (avatar_id BETWEEN 1 AND 10),
    has_seen_intro BOOLEAN DEFAULT FALSE,
    puntos_totales INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Puntajes y Récords por Minijuego
CREATE TABLE IF NOT EXISTS public.puntajes_minijuegos (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    juego_id TEXT NOT NULL, -- 'caza_abeja', 'punto_medio', 'radar', 'vias'
    nivel INTEGER NOT NULL,
    puntaje INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar Seguridad por Fila (Row Level Security - RLS)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puntajes_minijuegos ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Acceso Público (Para pruebas y juego escolar sin bloqueo)
-- Permitir lectura y escritura a cualquier cliente con la clave pública anónima (anon key)
DROP POLICY IF EXISTS "Acceso publico total a usuarios" ON public.usuarios;
CREATE POLICY "Acceso publico total a usuarios" 
ON public.usuarios 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso publico total a puntajes" ON public.puntajes_minijuegos;
CREATE POLICY "Acceso publico total a puntajes" 
ON public.puntajes_minijuegos 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Índices para acelerar el Leaderboard (Tabla de clasificación)
CREATE INDEX IF NOT EXISTS idx_usuarios_puntos ON public.usuarios (puntos_totales DESC);
CREATE INDEX IF NOT EXISTS idx_puntajes_juego ON public.puntajes_minijuegos (juego_id, puntaje DESC);

