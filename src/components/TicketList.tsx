import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Wrench, Monitor, Wifi, Settings, Edit, X, Loader2, Plus } from 'lucide-react';
import TicketForm from './TicketForm';
import { useTickets, Ticket } from '@/hooks/useTickets';

const TicketList = () => {
  const { tickets, loading, updateTicket } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCloseTicket = async (ticketId: string) => {
    await updateTicket(ticketId, { 
      status: 'closed',
      end_date: new Date().toISOString()
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hardware': return <Wrench className="h-4 w-4" />;
      case 'software': return <Monitor className="h-4 w-4" />;
      case 'network': return <Wifi className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hardware': return 'Hardware';
      case 'software': return 'Software';
      case 'network': return 'Red';
      case 'maintenance': return 'Mantenimiento';
      default: return type;
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'hardware': return 'destructive';
      case 'software': return 'default';
      case 'network': return 'secondary';
      case 'maintenance': return 'outline';
      default: return 'default';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'in_progress': return 'secondary';
      case 'closed': return 'outline';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Abierto';
      case 'in_progress': return 'En progreso';
      case 'closed': return 'Cerrado';
      default: return status;
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'low': return 'outline';
      case 'medium': return 'secondary';
      case 'high': return 'default';
      case 'urgent': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <section className="py-20 bg-background" id="tickets">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Gestión de Tickets
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Administra y supervisa todos los tickets de soporte técnico
          </p>
          <Button 
            onClick={() => setIsFormOpen(true)} 
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-5 w-5 mr-2" />
            Crear Nuevo Ticket
          </Button>
        </div>

        <TicketForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)}
        />

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Cargando tickets...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold">{ticket.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getTypeVariant(ticket.type)}>
                        {getTypeIcon(ticket.type)}
                        <span className="ml-1">{getTypeLabel(ticket.type)}</span>
                      </Badge>
                      <Badge variant={getStatusVariant(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                      <Badge variant={getPriorityVariant(ticket.priority)}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Inicio: {new Date(ticket.start_date).toLocaleDateString('es-ES')}</span>
                    {ticket.end_date && (
                      <>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>Fin: {new Date(ticket.end_date).toLocaleDateString('es-ES')}</span>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{ticket.detail}</p>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    {ticket.status !== 'closed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCloseTicket(ticket.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cerrar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTicket && (
          <TicketForm 
            isOpen={!!selectedTicket}
            onClose={() => setSelectedTicket(null)}
            initialData={selectedTicket}
          />
        )}
      </div>
    </section>
  );
};

export default TicketList;