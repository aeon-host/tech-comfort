import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: 'total' | 'open' | 'in_progress' | 'closed';
}

const StatsCard = ({ title, value, icon: Icon, variant }: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'total':
        return 'text-primary border-primary/20 bg-primary/5';
      case 'open':
        return 'text-destructive border-destructive/20 bg-destructive/5';
      case 'in_progress':
        return 'text-amber-600 border-amber-600/20 bg-amber-600/5';
      case 'closed':
        return 'text-green-600 border-green-600/20 bg-green-600/5';
      default:
        return 'text-primary border-primary/20 bg-primary/5';
    }
  };

  return (
    <Card className={`border-2 ${getVariantStyles()}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <Icon className="h-8 w-8 opacity-70" />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;