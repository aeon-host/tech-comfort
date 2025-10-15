-- Guardar datos existentes temporalmente
CREATE TABLE temp_tickets_backup AS SELECT * FROM public.tickets;

-- Eliminar tabla actual
DROP TABLE IF EXISTS public.tickets CASCADE;

-- Recrear tabla tickets con start_date usando now() como default
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  detail TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'::text,
  priority TEXT NOT NULL DEFAULT 'medium'::text,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Recrear políticas RLS
CREATE POLICY "Users can view all tickets" 
ON public.tickets 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create tickets" 
ON public.tickets 
FOR INSERT 
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can update all tickets" 
ON public.tickets 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can delete all tickets" 
ON public.tickets 
FOR DELETE 
USING (true);

-- Restaurar datos manteniendo las fechas originales
INSERT INTO public.tickets (id, user_id, name, type, detail, status, priority, start_date, end_date, created_at, updated_at)
SELECT id, user_id, name, type, detail, status, priority, start_date, end_date, created_at, updated_at
FROM temp_tickets_backup;

-- Eliminar tabla temporal
DROP TABLE temp_tickets_backup;

-- Recrear trigger para updated_at
CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();