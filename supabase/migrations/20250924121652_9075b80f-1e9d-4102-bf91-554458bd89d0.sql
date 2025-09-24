-- Create tickets table for support system
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hardware', 'software', 'network', 'maintenance')),
  detail TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for tickets (public access for now - can be restricted later)
CREATE POLICY "Anyone can view tickets" 
ON public.tickets 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create tickets" 
ON public.tickets 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update tickets" 
ON public.tickets 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete tickets" 
ON public.tickets 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.tickets (name, type, detail, start_date, end_date, status, priority) VALUES
('Reparación impresora oficina 1', 'hardware', 'Impresora HP LaserJet no está funcionando correctamente. Error de papel atascado y problemas de conectividad.', '2024-01-15 09:00:00+00', '2024-01-15 14:30:00+00', 'closed', 'medium'),
('Actualización sistema operativo', 'software', 'Actualizar sistemas operativos en todas las computadoras del departamento de ventas para mejorar seguridad.', '2024-01-16 10:00:00+00', NULL, 'in_progress', 'high'),
('Configuración red WiFi', 'network', 'Configurar nueva red WiFi empresarial con mayor seguridad y cobertura en toda la oficina.', '2024-01-17 08:30:00+00', NULL, 'open', 'medium'),
('Mantenimiento servidores', 'maintenance', 'Mantenimiento preventivo de servidores principales. Incluye limpieza, verificación de componentes y backup.', '2024-01-18 06:00:00+00', NULL, 'open', 'urgent'),
('Instalación software contabilidad', 'software', 'Instalar y configurar nuevo software de contabilidad en 5 computadoras del departamento financiero.', '2024-01-19 09:00:00+00', NULL, 'open', 'low');