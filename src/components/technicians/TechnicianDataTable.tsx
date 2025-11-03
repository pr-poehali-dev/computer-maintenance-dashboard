import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { DataTable, Column } from "@/components/ui/data-table";
import { Technician, TechnicianStatus } from "@/types";

interface TechnicianWithStats extends Technician {
  activeRepairs: number;
  completedThisMonth: number;
  revenue: number;
  avgRepairTime: number;
  workload: number;
}

interface TechnicianDataTableProps {
  technicians: TechnicianWithStats[];
  onEdit: (tech: Technician) => void;
  onDelete: (id: string) => void;
  onViewDetails: (tech: Technician) => void;
  onStatusChange: (tech: Technician, status: TechnicianStatus) => void;
  getStatusBadge: (status: TechnicianStatus) => JSX.Element;
  getWorkloadColor: (workload: number) => string;
}

export const TechnicianDataTable = ({
  technicians,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange,
  getStatusBadge,
  getWorkloadColor
}: TechnicianDataTableProps) => {
  const columns: Column<TechnicianWithStats>[] = [
    {
      key: "name",
      label: "Техник",
      render: (tech) => (
        <div>
          <div className="font-medium">{tech.name}</div>
          <div className="text-sm text-muted-foreground">{tech.phone}</div>
        </div>
      )
    },
    {
      key: "specialization",
      label: "Специализация",
      render: (tech) => (
        <div className="flex flex-wrap gap-1">
          {tech.specialization.slice(0, 2).map((spec, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {spec}
            </Badge>
          ))}
          {tech.specialization.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{tech.specialization.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    {
      key: "status",
      label: "Статус",
      render: (tech) => (
        <div className="flex flex-col gap-1">
          {getStatusBadge(tech.status)}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => onStatusChange(tech, 'available')}
              disabled={tech.status === 'available'}
            >
              Доступен
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => onStatusChange(tech, 'busy')}
              disabled={tech.status === 'busy'}
            >
              Занят
            </Button>
          </div>
        </div>
      )
    },
    {
      key: "workload",
      label: "Нагрузка",
      render: (tech) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>{tech.activeRepairs} активных</span>
            <span className="font-semibold">{tech.workload}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getWorkloadColor(tech.workload)}`}
              style={{ width: `${tech.workload}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: "performance",
      label: "Показатели",
      render: (tech) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-1">
            <Icon name="CheckCircle" size={14} className="text-green-600" />
            <span>{tech.completedRepairs} всего</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="TrendingUp" size={14} className="text-blue-600" />
            <span>{tech.completedThisMonth} за месяц</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Star" size={14} className="text-yellow-500" />
            <span>{tech.rating.toFixed(1)} рейтинг</span>
          </div>
        </div>
      )
    },
    {
      key: "revenue",
      label: "Доход",
      render: (tech) => (
        <div className="space-y-1">
          <div className="font-semibold">₽{tech.revenue.toLocaleString()}</div>
          {tech.avgRepairTime > 0 && (
            <div className="text-xs text-muted-foreground">
              Ср. время: {tech.avgRepairTime} дн.
            </div>
          )}
        </div>
      )
    },
    {
      key: "actions",
      label: "Действия",
      render: (tech) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails(tech)}
          >
            <Icon name="Eye" size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(tech)}
          >
            <Icon name="Edit" size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(tech.id)}
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      )
    }
  ];

  return <DataTable columns={columns} data={technicians} />;
};
