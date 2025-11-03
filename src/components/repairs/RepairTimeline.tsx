import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Repair } from "@/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface RepairTimelineProps {
  repairs: Repair[];
  limit?: number;
}

const statusIcons = {
  new: "FileText",
  in_progress: "Wrench",
  waiting_parts: "Clock",
  completed: "CheckCircle",
  cancelled: "XCircle"
};

const statusColors = {
  new: "bg-purple-100 text-purple-700",
  in_progress: "bg-blue-100 text-blue-700",
  waiting_parts: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700"
};

export const RepairTimeline = ({ repairs, limit = 10 }: RepairTimelineProps) => {
  const sortedRepairs = repairs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Activity" size={20} />
          История заявок
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border" />
          
          {sortedRepairs.map((repair, index) => {
            const icon = statusIcons[repair.status] || "FileText";
            const color = statusColors[repair.status] || statusColors.new;
            
            return (
              <div key={repair.id} className="relative pl-10">
                <div className={`absolute left-0 top-1 h-8 w-8 rounded-full ${color} flex items-center justify-center shadow-sm z-10`}>
                  <Icon name={icon} size={16} />
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {repair.deviceType} {repair.deviceModel}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {repair.clientName}
                      </p>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">
                      {format(new Date(repair.createdAt), "d MMM", { locale: ru })}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {repair.problem}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="DollarSign" size={12} />
                        {repair.finalCost || repair.estimatedCost || 0} ₽
                      </span>
                      {repair.technicianName && (
                        <span className="flex items-center gap-1 truncate max-w-[120px]">
                          <Icon name="UserCog" size={12} />
                          {repair.technicianName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {repairs.length > limit && (
          <div className="text-center mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Показано {limit} из {repairs.length} заявок
            </p>
          </div>
        )}

        {sortedRepairs.length === 0 && (
          <div className="text-center py-8">
            <Icon name="FileX" size={48} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Нет заявок</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
