
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  icon?: LucideIcon;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const StatusBadge = ({ status, icon: Icon, variant = "default" }: StatusBadgeProps) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200';
      case 'confirmed':
      case 'sent':
      case 'delivered':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      case 'completed':
      case 'responded':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case 'no_show':
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      case 'read':
        return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');

  return (
    <Badge 
      variant={variant}
      className={`${getStatusStyle(status)} font-medium px-3 py-1 text-xs border transition-colors duration-200`}
    >
      <div className="flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        <span>{displayStatus}</span>
      </div>
    </Badge>
  );
};

export default StatusBadge;
