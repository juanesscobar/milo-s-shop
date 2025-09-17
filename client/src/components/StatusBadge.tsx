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
    color: 'text-muted-foreground'
  },
  washing: {
    variant: 'default' as const,
    icon: Droplets,
    defaultText: 'En lavado',
    color: 'text-primary-foreground'
  },
  done: {
    variant: 'outline' as const,
    icon: CheckCircle,
    defaultText: 'Finalizado',
    color: 'text-green-600'
  },
  cancelled: {
    variant: 'destructive' as const,
    icon: XCircle,
    defaultText: 'Cancelado',
    color: 'text-destructive-foreground'
  }
};

export default function StatusBadge({ status, text, size = 'default' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const IconComponent = config.icon;
  const displayText = text || config.defaultText;

  return (
    <Badge 
      variant={config.variant}
      className="flex items-center gap-1"
      data-testid={`badge-status-${status}`}
    >
      <IconComponent className={`h-3 w-3 ${config.color}`} />
      <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>
        {displayText}
      </span>
    </Badge>
  );
}