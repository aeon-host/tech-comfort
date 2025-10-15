-- Eliminar la política restrictiva actual
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.tickets;

-- Crear nueva política que permita ver todos los tickets
CREATE POLICY "Users can view all tickets" 
ON public.tickets 
FOR SELECT 
USING (true);

-- Actualizar política de inserción para permitir crear tickets sin user_id o con el user_id del usuario
DROP POLICY IF EXISTS "Users can create their own tickets" ON public.tickets;

CREATE POLICY "Users can create tickets" 
ON public.tickets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Actualizar política de actualización para permitir modificar cualquier ticket
DROP POLICY IF EXISTS "Users can update their own tickets" ON public.tickets;

CREATE POLICY "Users can update all tickets" 
ON public.tickets 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Actualizar política de eliminación para permitir eliminar cualquier ticket
DROP POLICY IF EXISTS "Users can delete their own tickets" ON public.tickets;

CREATE POLICY "Users can delete all tickets" 
ON public.tickets 
FOR DELETE 
USING (true);