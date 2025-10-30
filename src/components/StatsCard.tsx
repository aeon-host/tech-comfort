import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: 'total' | 'open' | 'in_progress' | 'closed';
  onClick?: () => void;
}

const StatsCard = ({ title, value, icon: Icon, variant, onClick }: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'total':
        return 'bg-primary/10 text-primary';
      case 'open':
        return 'bg-destructive/10 text-destructive';
      case 'in_progress':
        return 'bg-amber-500/10 text-amber-600';
      case 'closed':
        return 'bg-green-500/10 text-green-600';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div 
      className={`rounded-lg p-4 flex items-center gap-4 transition-all hover:shadow-lg ${getVariantStyles()} ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <Icon className="h-6 w-6" />
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs opacity-80">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;