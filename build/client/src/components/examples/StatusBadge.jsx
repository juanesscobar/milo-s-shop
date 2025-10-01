import StatusBadge from '../StatusBadge';
export default function StatusBadgeExample() {
    return (<div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="waiting"/>
        <StatusBadge status="washing"/>
        <StatusBadge status="done"/>
        <StatusBadge status="cancelled"/>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="waiting" text="Em espera" size="sm"/>
        <StatusBadge status="washing" text="Lavando" size="sm"/>
        <StatusBadge status="done" text="Pronto" size="sm"/>
        <StatusBadge status="cancelled" text="Cancelado" size="sm"/>
      </div>
    </div>);
}
