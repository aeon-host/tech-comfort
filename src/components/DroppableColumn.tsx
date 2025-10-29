import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Badge } from './ui/badge';
import DraggableTicket from './DraggableTicket';

interface DroppableColumnProps {
  priority: 'urgent' | 'high' | 'medium' | 'low';
  label: string;
  emoji: string;
  tickets: any[];
  onEdit: (ticket: any) => void;
  onDelete: (id: string) => void;
}

const DroppableColumn = ({ priority, label, emoji, tickets, onEdit, onDelete }: DroppableColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: priority,
  });

  return (
    <div className="flex flex-col">
      <div className="bg-muted/50 rounded-t-lg p-4 sticky top-16 z-10 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <span>{emoji}</span>
            <span>{label}</span>
          </h3>
          <Badge variant="secondary">{tickets.length}</Badge>
        </div>
      </div>
      
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-4 p-4 bg-muted/20 rounded-b-lg min-h-[400px] transition-colors ${
          isOver ? 'bg-primary/10 ring-2 ring-primary' : ''
        }`}
      >
        {tickets.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay tickets
          </p>
        ) : (
          tickets.map((ticket) => (
            <DraggableTicket
              key={ticket.id}
              ticket={ticket}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DroppableColumn;
