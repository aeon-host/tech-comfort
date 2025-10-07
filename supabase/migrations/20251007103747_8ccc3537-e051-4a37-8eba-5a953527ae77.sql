-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view all tickets" ON public.tickets;
DROP POLICY IF EXISTS "Authenticated users can create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Authenticated users can update all tickets" ON public.tickets;
DROP POLICY IF EXISTS "Authenticated users can delete all tickets" ON public.tickets;

-- Create new policies that restrict access to the ticket owner only
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
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tickets"
ON public.tickets
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);