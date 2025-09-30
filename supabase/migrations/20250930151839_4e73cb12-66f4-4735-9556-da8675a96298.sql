-- Eliminar las políticas RLS restrictivas actuales
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can create their own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can update their own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can delete their own tickets" ON public.tickets;

-- Crear nuevas políticas para tickets compartidos
CREATE POLICY "Authenticated users can view all tickets"
ON public.tickets
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create tickets"
ON public.tickets
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update all tickets"
ON public.tickets
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete all tickets"
ON public.tickets
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Modificar la función para crear tickets globales solo una vez
CREATE OR REPLACE FUNCTION public.create_global_sample_tickets()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Solo crear tickets si no existen tickets globales de ejemplo
  IF NOT EXISTS (SELECT 1 FROM public.tickets LIMIT 1) THEN
    
    INSERT INTO public.tickets (user_id, name, type, detail, status, priority, start_date, end_date) VALUES
    (NULL, 'Problema con impresora HP', 'hardware', 'La impresora del departamento de contabilidad no imprime en color. Se necesita revisar los cartuchos de tinta y la configuración del driver.', 'open', 'medium', now() - interval '2 days', null),
    
    (NULL, 'Actualización software ERP', 'software', 'Solicitud para actualizar el sistema ERP a la última versión. Incluye nuevas funcionalidades de reportes y mejoras de seguridad.', 'in_progress', 'high', now() - interval '5 days', now() + interval '3 days'),
    
    (NULL, 'Red lenta en planta baja', 'network', 'Los usuarios de la planta baja reportan velocidad de internet muy lenta. Revisar switches y configuración de red.', 'open', 'high', now() - interval '1 day', null),
    
    (NULL, 'Mantenimiento servidor principal', 'maintenance', 'Mantenimiento programado del servidor principal. Incluye limpieza, actualización de drivers y verificación de componentes.', 'closed', 'medium', now() - interval '10 days', now() - interval '8 days'),
    
    (NULL, 'Instalación Office 365', 'software', 'Instalar y configurar Office 365 en las nuevas computadoras del departamento de marketing.', 'open', 'low', now() - interval '3 days', null),
    
    (NULL, 'Cambio de UPS sala servidores', 'hardware', 'Reemplazar el UPS de la sala de servidores por uno de mayor capacidad debido al crecimiento de equipos.', 'in_progress', 'urgent', now() - interval '7 days', now() + interval '2 days'),
    
    (NULL, 'Configuración WiFi invitados', 'network', 'Configurar red WiFi para visitantes con acceso limitado a internet y aislada de la red corporativa.', 'closed', 'low', now() - interval '15 days', now() - interval '12 days'),
    
    (NULL, 'Backup automático fallido', 'maintenance', 'El sistema de backup automático ha fallado durante los últimos 3 días. Revisar y reparar el proceso.', 'open', 'urgent', now() - interval '1 day', null);
    
  END IF;
END;
$$;

-- Ejecutar la función para crear los tickets globales
SELECT public.create_global_sample_tickets();