-- Fix security vulnerability: Implement user-specific access control for tickets

-- Add user_id column to track ticket ownership
ALTER TABLE public.tickets 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing tickets to have a user_id (set to null for now, will need manual assignment)
-- In a real scenario, you'd want to assign these to appropriate users

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view tickets" ON public.tickets;
DROP POLICY IF EXISTS "Authenticated users can create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Authenticated users can update tickets" ON public.tickets;
DROP POLICY IF EXISTS "Authenticated users can delete tickets" ON public.tickets;

-- Create user-specific RLS policies
CREATE POLICY "Users can view their own tickets" 
ON public.tickets 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets" 
ON public.tickets 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" 
ON public.tickets 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tickets" 
ON public.tickets 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);