-- Crear tickets de ejemplo para demostrar la funcionalidad
-- Estos tickets se crearán cuando el primer usuario se autentique

-- Función para crear tickets de ejemplo para un usuario
CREATE OR REPLACE FUNCTION public.create_sample_tickets_for_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Solo crear tickets si el usuario no tiene ninguno
  IF NOT EXISTS (SELECT 1 FROM public.tickets WHERE user_id = target_user_id) THEN
    
    INSERT INTO public.tickets (user_id, name, type, detail, status, priority, start_date, end_date) VALUES
    (target_user_id, 'Problema con impresora HP', 'hardware', 'La impresora del departamento de contabilidad no imprime en color. Se necesita revisar los cartuchos de tinta y la configuración del driver.', 'open', 'medium', now() - interval '2 days', null),
    
    (target_user_id, 'Actualización software ERP', 'software', 'Solicitud para actualizar el sistema ERP a la última versión. Incluye nuevas funcionalidades de reportes y mejoras de seguridad.', 'in_progress', 'high', now() - interval '5 days', now() + interval '3 days'),
    
    (target_user_id, 'Red lenta en planta baja', 'network', 'Los usuarios de la planta baja reportan velocidad de internet muy lenta. Revisar switches y configuración de red.', 'open', 'high', now() - interval '1 day', null),
    
    (target_user_id, 'Mantenimiento servidor principal', 'maintenance', 'Mantenimiento programado del servidor principal. Incluye limpieza, actualización de drivers y verificación de componentes.', 'closed', 'medium', now() - interval '10 days', now() - interval '8 days'),
    
    (target_user_id, 'Instalación Office 365', 'software', 'Instalar y configurar Office 365 en las nuevas computadoras del departamento de marketing.', 'open', 'low', now() - interval '3 days', null),
    
    (target_user_id, 'Cambio de UPS sala servidores', 'hardware', 'Reemplazar el UPS de la sala de servidores por uno de mayor capacidad debido al crecimiento de equipos.', 'in_progress', 'urgent', now() - interval '7 days', now() + interval '2 days'),
    
    (target_user_id, 'Configuración WiFi invitados', 'network', 'Configurar red WiFi para visitantes con acceso limitado a internet y aislada de la red corporativa.', 'closed', 'low', now() - interval '15 days', now() - interval '12 days'),
    
    (target_user_id, 'Backup automático fallido', 'maintenance', 'El sistema de backup automático ha fallado durante los últimos 3 días. Revisar y reparar el proceso.', 'open', 'urgent', now() - interval '1 day', null);
    
  END IF;
END;
$$;

-- Trigger que crea automáticamente tickets de ejemplo cuando un nuevo usuario se registra
CREATE OR REPLACE FUNCTION public.handle_new_user_sample_tickets()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Crear tickets de ejemplo para el nuevo usuario después de un pequeño delay
  PERFORM public.create_sample_tickets_for_user(NEW.id);
  RETURN NEW;
END;
$$;

-- No podemos crear un trigger directamente en auth.users ya que es un esquema reservado
-- En su lugar, crearemos los tickets cuando el usuario haga login por primera vez

COMMENT ON FUNCTION public.create_sample_tickets_for_user IS 'Crea tickets de ejemplo para demostrar la funcionalidad del sistema';
COMMENT ON FUNCTION public.handle_new_user_sample_tickets IS 'Maneja la creación de tickets de ejemplo para nuevos usuarios';