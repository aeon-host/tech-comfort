import React, { useState } from 'react';
import { useTickets } from '@/hooks/useTickets';
import TicketForm from './TicketForm';
import StatsCard from './StatsCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Ticket, FolderOpen, Clock, CheckCircle, Search, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import DraggableTicket from './DraggableTicket';

const TicketList = () => {
  const {
    tickets,
    loading,
    createTicket,
    updateTicket,
    deleteTicket,
    refetch,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    stats,
  } = useTickets();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const ticketId = active.id as string;
    const newPriority = over.id as 'urgent' | 'high' | 'medium' | 'low';
    
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (ticket && ticket.priority !== newPriority) {
      try {
        await updateTicket(ticketId, { priority: newPriority });
        toast({
          title: "Prioridad actualizada",
          description: `El ticket se movió a ${newPriority}`,
        });
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar la prioridad",
          variant: "destructive",
        });
      }
    }
    
    setActiveId(null);
  };

  const handleEdit = (ticket: any) => {
    setEditingTicket(ticket);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTicket(null);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingTicket) {
        await updateTicket(editingTicket.id, data);
        toast({
          title: "Ticket actualizado",
          description: "El ticket se ha actualizado correctamente.",
        });
      } else {
        await createTicket(data);
        toast({
          title: "Ticket creado",
          description: "El ticket se ha creado correctamente.",
        });
      }
      handleFormClose();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al guardar el ticket.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (ticketToDelete) {
      try {
        await deleteTicket(ticketToDelete);
        toast({
          title: "Ticket eliminado",
          description: "El ticket se ha eliminado correctamente.",
        });
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Hubo un error al eliminar el ticket.",
          variant: "destructive",
        });
      }
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  return (
    <section className="py-20 bg-background" id="tickets">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tickets abiertos en tiempo real
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Administra y supervisa todos los tickets de soporte técnico
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatsCard title="Total" value={stats.total} icon={Ticket} variant="total" />
          <StatsCard title="Abiertos" value={stats.open} icon={FolderOpen} variant="open" />
          <StatsCard title="En Progreso" value={stats.in_progress} icon={Clock} variant="in_progress" />
          <StatsCard title="Cerrados" value={stats.closed} icon={CheckCircle} variant="closed" />
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="open">Abiertos</SelectItem>
                  <SelectItem value="in_progress">En Progreso</SelectItem>
                  <SelectItem value="closed">Cerrados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="network">Red</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={() => setIsFormOpen(true)} 
                size="lg"
                className="whitespace-nowrap"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nuevo Ticket
              </Button>
            </div>
          </div>
        </div>

        <TicketForm 
          isOpen={isFormOpen} 
          onClose={handleFormClose}
          initialData={editingTicket}
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p className="text-muted-foreground">Cargando tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No hay tickets</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'No se encontraron tickets con los filtros aplicados.'
                : 'Aún no hay tickets creados. Crea el primer ticket para comenzar.'
              }
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Ticket
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {(['urgent', 'high', 'medium', 'low'] as const).map((priority) => {
                const priorityTickets = tickets.filter(ticket => ticket.priority === priority);
                const priorityLabels = {
                  urgent: { label: 'Urgente', emoji: '🔴' },
                  high: { label: 'Alta', emoji: '🟠' },
                  medium: { label: 'Media', emoji: 'đŸŸĄ' },
                  low: { label: 'Baja', emoji: '🟢' }
                };

                return (
                  <div
                    key={priority}
                    id={priority}
                    className="flex flex-col"
                  >
                    <div className="bg-muted/50 rounded-t-lg p-4 sticky top-16 z-10 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                          <span>{priorityLabels[priority].emoji}</span>
                          <span>{priorityLabels[priority].label}</span>
                        </h3>
                        <Badge variant="secondary">{priorityTickets.length}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4 p-4 bg-muted/20 rounded-b-lg min-h-[400px]">
                      {priorityTickets.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No hay tickets
                        </p>
                      ) : (
                        priorityTickets.map((ticket) => (
                          <DraggableTicket
                            key={ticket.id}
                            ticket={ticket}
                            onEdit={handleEdit}
                            onDelete={(id) => {
                              setTicketToDelete(id);
                              setDeleteDialogOpen(true);
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <DragOverlay>
              {activeId ? (
                <div className="bg-card rounded-lg border shadow-lg p-4 opacity-90 rotate-3 scale-105">
                  <p className="text-sm font-semibold">Moviendo ticket...</p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El ticket será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default TicketList;
