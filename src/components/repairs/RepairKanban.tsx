import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import { Repair, RepairStatus } from "@/types";

interface RepairKanbanProps {
  repairs: Repair[];
  onRepairClick?: (repair: Repair) => void;
  onStatusChange?: (repairId: string, newStatus: RepairStatus) => void;
}

const columns = [
  { id: 'new' as RepairStatus, title: 'Новые', icon: 'FileText', color: 'bg-purple-100 border-purple-200', textColor: 'text-purple-700' },
  { id: 'in_progress' as RepairStatus, title: 'В работе', icon: 'Wrench', color: 'bg-blue-100 border-blue-200', textColor: 'text-blue-700' },
  { id: 'waiting_parts' as RepairStatus, title: 'Ожидание', icon: 'Clock', color: 'bg-yellow-100 border-yellow-200', textColor: 'text-yellow-700' },
  { id: 'completed' as RepairStatus, title: 'Завершено', icon: 'CheckCircle', color: 'bg-green-100 border-green-200', textColor: 'text-green-700' }
];

const priorityConfig = {
  urgent: { color: 'bg-red-500', label: 'Срочно' },
  high: { color: 'bg-orange-500', label: 'Высокий' },
  medium: { color: 'bg-blue-500', label: 'Средний' },
  low: { color: 'bg-gray-400', label: 'Низкий' }
};

export const RepairKanban = ({ repairs, onRepairClick, onStatusChange }: RepairKanbanProps) => {
  const getColumnRepairs = (status: RepairStatus) => {
    return repairs.filter(r => r.status === status);
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {columns.map(column => {
        const columnRepairs = getColumnRepairs(column.id);
        
        return (
          <Card key={column.id} className={`border-2 ${column.color}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon name={column.icon} size={18} className={column.textColor} />
                  {column.title}
                </CardTitle>
                <Badge variant="secondary" className={column.textColor}>
                  {columnRepairs.length}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2 p-4 pt-0">
                  {columnRepairs.map(repair => {
                    const priority = priorityConfig[repair.priority];
                    
                    return (
                      <Card 
                        key={repair.id} 
                        className="hover:shadow-md transition-all cursor-pointer border-l-4"
                        style={{ borderLeftColor: priority.color.replace('bg-', '#') }}
                        onClick={() => onRepairClick?.(repair)}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {repair.deviceType}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {repair.deviceModel}
                              </p>
                            </div>
                            <div className={`h-2 w-2 rounded-full ${priority.color} flex-shrink-0 mt-1.5`} 
                                 title={priority.label} />
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Icon name="User" size={12} />
                            <span className="truncate">{repair.clientName}</span>
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {repair.problem}
                          </p>
                          
                          <div className="flex items-center justify-between pt-2 border-t text-xs">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Icon name="DollarSign" size={12} />
                              <span>{repair.finalCost || repair.estimatedCost || 0} ₽</span>
                            </div>
                            {repair.technicianName && (
                              <div className="flex items-center gap-1 text-muted-foreground truncate max-w-[100px]">
                                <Icon name="UserCog" size={12} />
                                <span className="truncate">{repair.technicianName}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {columnRepairs.length === 0 && (
                    <div className="text-center py-8">
                      <Icon name="FileX" size={32} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Нет заявок</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
