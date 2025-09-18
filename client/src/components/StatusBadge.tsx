import { Badge } from "@/components/ui/badge";
import { Clock, Droplets, CheckCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: 'waiting' | 'washing' | 'done' | 'cancelled';
  text?: string;
  size?: 'sm' | 'default';
}

const statusConfig = {
  waiting: {
    variant: 'secondary' as const,
    icon: Clock,
    defaultText: 'En espera',
    color: '#9CA3AF',
    bgColor: 'bg-gray-100', 
    textColor: 'text-gray-400',
    emoji: '⏳'
  },
  washing: {
    variant: 'default' as const, 
    icon: Droplets,
    defaultText: 'En lavado',
    color: '#F97316',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-500',
    emoji: '🚿'
  },
  done: {
    variant: 'outline' as const,
    icon: CheckCircle,
    defaultText: 'Finalizado',
    color: '#16A34A',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    emoji: '✅'
  },
  cancelled: {
    variant: 'destructive' as const,
    icon: XCircle,
    defaultText: 'Cancelado',
    color: '#DC2626',
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
    emoji: '✖️'
  }
};

export default function StatusBadge({ status, text, size = 'default' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const displayText = text || config.defaultText;

  return (
    <Badge 
      variant="outline"
      className={`flex items-center gap-1 ${config.bgColor} ${config.textColor} border-current`}
      data-testid={`badge-status-${status}`}
    >
      <span className="text-sm">{config.emoji}</span>
      <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>
        {displayText}
      </span>
    </Badge>
  );
}