import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Wrench, Monitor, Wifi, Settings, Edit, X, Loader2, Plus, Search, BarChart3, AlertCircle, Clock4, CheckCircle2 } from 'lucide-react';
import TicketForm from './TicketForm';
import StatsCard from './StatsCard';
import { useTickets, Ticket } from '@/hooks/useTickets';

const TicketList = () => {
  const { 
    tickets, 
    loading, 
    updateTicket, 
    searchTerm, 
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    stats: hookStats
  } = useTickets();
  const stats = hookStats ?? { total: 0, open: 0, in_progress: 0, closed: 0 };
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
      case 'hardware': return <span className="text-lg">💻</span>;
      case 'software': return <span className="text-lg">🖥️</span>;
      case 'network': return <span className="text-lg">🌐</span>;
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
panel de tickets y reportes
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Administra y supervisa todos los tickets de soporte técnico
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tickets"
            value={stats.total}
            icon={BarChart3}
            variant="total"
          />
          <StatsCard
            title="Abiertos"
            value={stats.open}
            icon={AlertCircle}
            variant="open"
          />
          <StatsCard
            title="En Progreso"
            value={stats.in_progress}
            icon={Clock4}
            variant="in_progress"
          />
          <StatsCard
            title="Cerrados"
            value={stats.closed}
            icon={CheckCircle2}
            variant="closed"
          />
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
                  <SelectItem value="active">Tickets Activos</SelectItem>
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg whitespace-nowrap"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nuevo Ticket
              </Button>
            </div>
          </div>
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
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            {statusFilter === 'active' ? (
              <>
                <CheckCircle2 className="h-16 w-16 text-status-closed mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No tienes tickets pendientes 🎉</h3>
                <p className="text-muted-foreground mb-6">
                  Excelente trabajo. Todos los tickets han sido completados.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setIsFormOpen(true)} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Ticket
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setStatusFilter('closed')}
                    className="border-muted-foreground/20"
                  >
                    Ver Cerrados
                  </Button>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No hay tickets</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                    ? 'No se encontraron tickets con los filtros aplicados.'
                    : 'Aún no hay tickets creados. Crea el primer ticket para comenzar.'
                  }
                </p>
                <Button onClick={() => setIsFormOpen(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Ticket
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-lg transition-all duration-300 border-l-4 bg-card shadow-sm" 
                    style={{
                      borderLeftColor: ticket.status === 'open' ? 'hsl(var(--status-open))' : 
                                     ticket.status === 'in_progress' ? 'hsl(var(--status-progress))' : 'hsl(var(--status-closed))'
                    }}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl font-semibold text-foreground mb-2 break-words">
                        {ticket.name}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge 
                          variant={getStatusVariant(ticket.status)}
                          className={
                            ticket.status === 'open' ? 'bg-status-open/10 text-status-open border-status-open/20' :
                            ticket.status === 'in_progress' ? 'bg-status-progress/10 text-status-progress border-status-progress/20' :
                            'bg-status-closed/10 text-status-closed border-status-closed/20'
                          }
                        >
                          {getStatusLabel(ticket.status)}
                        </Badge>
                        <Badge variant={getTypeVariant(ticket.type)} className="bg-primary/5 text-primary border-primary/20">
                          {getTypeIcon(ticket.type)}
                          <span className="ml-1">{getTypeLabel(ticket.type)}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Inicio: {new Date(ticket.start_date).toLocaleDateString('es-ES')}</span>
                    </div>
                    {ticket.end_date && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Término: {new Date(ticket.end_date).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {ticket.detail}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => setSelectedTicket(ticket)}
                      className="hover:bg-secondary/80"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    {ticket.status !== 'closed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCloseTicket(ticket.id)}
                        className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
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