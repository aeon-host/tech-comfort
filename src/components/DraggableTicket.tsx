import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DraggableTicketProps {
  ticket: any;
  onEdit: (ticket: any) => void;
  onDelete: (id: string) => void;
}

const DraggableTicket = ({ ticket, onEdit, onDelete }: DraggableTicketProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id,
    data: {
      ticket,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-grab active:cursor-grabbing"
    >
      {/* Priority indicator bar */}
      <div className={`h-1 ${
        ticket.priority === 'urgent' ? 'bg-red-500' :
        ticket.priority === 'high' ? 'bg-orange-500' :
        ticket.priority === 'medium' ? 'bg-yellow-500' :
        'bg-green-500'
      }`} />
      
      <div className="p-4 space-y-3">
        {/* Header with badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge className={`text-xs font-semibold border ${
              ticket.priority === 'urgent' ? 'bg-red-500/20 text-red-700 border-red-500/50' :
              ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-700 border-orange-500/50' :
              ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50' :
              'bg-green-500/20 text-green-700 border-green-500/50'
            }`}>
              {ticket.priority === 'urgent' ? '🔴 Urgente' :
               ticket.priority === 'high' ? '🟠 Alta' :
               ticket.priority === 'medium' ? '🟡 Media' :
               '🟢 Baja'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {ticket.type === 'hardware' ? 'Hardware' :
               ticket.type === 'software' ? 'Software' :
               ticket.type === 'network' ? 'Red' :
               ticket.type === 'maintenance' ? 'Mantenimiento' :
               ticket.type}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-sm line-clamp-2 leading-tight">
          {ticket.name}
        </h4>

        {/* Description */}
        {ticket.detail && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {ticket.detail}
          </p>
        )}

        {/* Date */}
        <p className="text-xs text-muted-foreground">
          {format(new Date(ticket.created_at), "d 'de' MMMM, HH:mm", { locale: es })}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(ticket);
            }}
            className="flex-1 h-8 text-xs"
          >
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(ticket.id);
            }}
            className="h-8 text-xs"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DraggableTicket;
