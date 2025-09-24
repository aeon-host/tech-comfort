import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTickets, Ticket } from '@/hooks/useTickets';

interface TicketFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Ticket;
}

const TicketForm: React.FC<TicketFormProps> = ({ isOpen, onClose, initialData }) => {
  const { createTicket, updateTicket } = useTickets();
  const [formData, setFormData] = useState<{
    name: string;
    type: 'hardware' | 'software' | 'network' | 'maintenance';
    detail: string;
    start_date: string;
    end_date: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }>({
    name: '',
    type: 'hardware',
    detail: '',
    start_date: '',
    end_date: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        detail: initialData.detail,
        start_date: initialData.start_date.split('T')[0], // Format for date input
        end_date: initialData.end_date ? initialData.end_date.split('T')[0] : '',
        priority: initialData.priority
      });
    } else {
      setFormData({
        name: '',
        type: 'hardware',
        detail: '',
        start_date: new Date().toISOString().split('T')[0], // Today's date
        end_date: '',
        priority: 'medium'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.detail.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    const ticketData = {
      name: formData.name.trim(),
      type: formData.type,
      detail: formData.detail.trim(),
      start_date: new Date(formData.start_date).toISOString(),
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
      priority: formData.priority
    };
    
    try {
      let result;
      if (initialData) {
        result = await updateTicket(initialData.id, ticketData);
      } else {
        result = await createTicket(ticketData);
      }
      
      if (result.success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Ticket' : 'Crear Nuevo Ticket'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del ticket</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Descripción breve del problema"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hardware">Hardware</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="network">Red</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="detail">Detalle</Label>
            <Textarea
              id="detail"
              value={formData.detail}
              onChange={(e) => setFormData(prev => ({ ...prev, detail: e.target.value }))}
              placeholder="Descripción detallada del problema"
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="start_date">Fecha de inicio</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioridad</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {initialData && (
            <div className="space-y-2">
              <Label htmlFor="end_date">Fecha de término</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar Ticket' : 'Crear Ticket')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TicketForm;
export { TicketForm };