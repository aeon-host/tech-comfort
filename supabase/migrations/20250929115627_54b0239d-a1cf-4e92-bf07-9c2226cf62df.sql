-- Fix security vulnerability: Replace overly permissive RLS policies with authentication-based access control

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can view tickets" ON public.tickets;
DROP POLICY IF EXISTS "Anyone can create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Anyone can update tickets" ON public.tickets;
DROP POLICY IF EXISTS "Anyone can delete tickets" ON public.tickets;

-- Create secure authentication-based policies
CREATE POLICY "Authenticated users can view tickets" 
ON public.tickets 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create tickets" 
ON public.tickets 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update tickets" 
ON public.tickets 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete tickets" 
ON public.tickets 
FOR DELETE 
TO authenticated
USING (true);