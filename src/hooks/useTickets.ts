import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Ticket {
  id: string;
  name: string;
  type: 'hardware' | 'software' | 'network' | 'maintenance';
  detail: string;
  start_date: string;
  end_date?: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export const useTickets = () => {
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter tickets based on search and filters
  const tickets = allTickets.filter(ticket => {
    const matchesSearch = ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.detail.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = ticket.status !== 'closed';
    } else if (statusFilter !== 'all') {
      matchesStatus = ticket.status === statusFilter;
    }
    
    const matchesType = typeFilter === 'all' || ticket.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate stats
  const stats = {
    total: allTickets.length,
    open: allTickets.filter(t => t.status === 'open').length,
    in_progress: allTickets.filter(t => t.status === 'in_progress').length,
    closed: allTickets.filter(t => t.status === 'closed').length,
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllTickets(data as Ticket[] || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([ticketData])
        .select()
        .single();

      if (error) throw error;

      setAllTickets(prev => [data as Ticket, ...prev]);
      toast({
        title: "Éxito",
        description: "Ticket creado correctamente",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el ticket",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAllTickets(prev => prev.map(ticket => 
        ticket.id === id ? data as Ticket : ticket
      ));

      toast({
        title: "Éxito",
        description: "Ticket actualizado correctamente",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el ticket",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteTicket = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAllTickets(prev => prev.filter(ticket => ticket.id !== id));
      toast({
        title: "Éxito",
        description: "Ticket eliminado correctamente",
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el ticket",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    createTicket,
    updateTicket,
    deleteTicket,
    refetch: fetchTickets,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    stats,
  };
};