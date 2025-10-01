import { Badge } from "@/components/ui/badge";
import { Clock, Droplets, CheckCircle, XCircle } from "lucide-react";
var statusConfig = {
    waiting: {
        variant: 'secondary',
        icon: Clock,
        defaultText: 'En espera',
        color: '#9CA3AF',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-400',
        emoji: '⏳'
    },
    washing: {
        variant: 'default',
        icon: Droplets,
        defaultText: 'En lavado',
        color: '#F97316',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-500',
        emoji: '🚿'
    },
    done: {
        variant: 'outline',
        icon: CheckCircle,
        defaultText: 'Finalizado',
        color: '#16A34A',
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
        emoji: '✅'
    },
    cancelled: {
        variant: 'destructive',
        icon: XCircle,
        defaultText: 'Cancelado',
        color: '#DC2626',
        bgColor: 'bg-red-100',
        textColor: 'text-red-600',
        emoji: '✖️'
    }
};
export default function StatusBadge(_a) {
    var status = _a.status, text = _a.text, _b = _a.size, size = _b === void 0 ? 'default' : _b;
    var config = statusConfig[status];
    var displayText = text || config.defaultText;
    return (<Badge variant="outline" className={"flex items-center gap-1 ".concat(config.bgColor, " ").concat(config.textColor, " border-current")} data-testid={"badge-status-".concat(status)}>
      <span className="text-sm">{config.emoji}</span>
      <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>
        {displayText}
      </span>
    </Badge>);
}
