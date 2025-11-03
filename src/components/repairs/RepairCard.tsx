import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Repair } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface RepairCardProps {
  repair: Repair;
  onEdit?: (repair: Repair) => void;
  onView?: (repair: Repair) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const statusConfig = {
  new: { variant: "secondary" as const, label: "Новая", icon: "FileText", color: "bg-purple-100 text-purple-700" },
  in_progress: { variant: "default" as const, label: "В работе", icon: "Wrench", color: "bg-blue-100 text-blue-700" },
  waiting_parts: { variant: "outline" as const, label: "Ожидание", icon: "Clock", color: "bg-yellow-100 text-yellow-700" },
  completed: { variant: "outline" as const, label: "Завершено", icon: "CheckCircle", color: "bg-green-100 text-green-700" },
  cancelled: { variant: "destructive" as const, label: "Отменено", icon: "XCircle", color: "bg-red-100 text-red-700" }
};

const priorityConfig = {
  urgent: { color: "text-red-600", bg: "bg-red-50 border-red-200", label: "Срочно", icon: "AlertTriangle" },
  high: { color: "text-orange-600", bg: "bg-orange-50 border-orange-200", label: "Высокий", icon: "ArrowUp" },
  medium: { color: "text-blue-600", bg: "bg-blue-50 border-blue-200", label: "Средний", icon: "Minus" },
  low: { color: "text-gray-600", bg: "bg-gray-50 border-gray-200", label: "Низкий", icon: "ArrowDown" }
};

export const RepairCard = ({ repair, onEdit, onView, onDelete, onStatusChange }: RepairCardProps) => {
  const status = statusConfig[repair.status] || statusConfig.new;
  const priority = priorityConfig[repair.priority] || priorityConfig.medium;

  return (
    <Card className="hover:shadow-lg transition-all group border-l-4" style={{ borderLeftColor: status.color.split(' ')[0] }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg truncate">
                {repair.deviceType} {repair.deviceModel}
              </CardTitle>
              <Badge variant={status.variant} className="flex items-center gap-1">
                <Icon name={status.icon} size={12} />
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="User" size={14} />
              <span className="truncate">{repair.clientName}</span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-md text-xs font-medium ${priority.bg} ${priority.color} flex items-center gap-1`}>
            <Icon name={priority.icon} size={12} />
            {priority.label}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Icon name="AlertCircle" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm line-clamp-2">{repair.problem}</p>
          </div>
          
          {repair.diagnosis && (
            <div className="flex items-start gap-2">
              <Icon name="FileSearch" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground line-clamp-2">{repair.diagnosis}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t text-sm">
          <div className="flex items-center gap-2">
            <Icon name="Calendar" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(repair.createdAt), { addSuffix: true, locale: ru })}
            </span>
          </div>
          {repair.technicianName && (
            <div className="flex items-center gap-2">
              <Icon name="UserCog" size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground truncate">{repair.technicianName}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="DollarSign" size={14} className="text-muted-foreground" />
            <span className="font-medium">{repair.finalCost || repair.estimatedCost || 0} ₽</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">{repair.estimatedDays || 1} дн.</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {onView && (
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onView(repair)}>
              <Icon name="Eye" size={14} className="mr-1" />
              Детали
            </Button>
          )}
          {onEdit && (
            <Button size="sm" variant="outline" onClick={() => onEdit(repair)}>
              <Icon name="Edit" size={14} />
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="outline" onClick={() => onDelete(repair.id)}>
              <Icon name="Trash2" size={14} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
