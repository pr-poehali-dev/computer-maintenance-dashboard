import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Repair } from "@/types";
import { useMemo } from "react";

interface RepairAnalyticsProps {
  repairs: Repair[];
}

export const RepairAnalytics = ({ repairs }: RepairAnalyticsProps) => {
  const analytics = useMemo(() => {
    const deviceTypes: Record<string, number> = {};
    const priorityDist: Record<string, number> = { urgent: 0, high: 0, medium: 0, low: 0 };
    const technicianLoad: Record<string, { count: number; revenue: number; name: string }> = {};
    const monthlyRevenue: Record<string, number> = {};
    
    let totalCost = 0;
    let completedCount = 0;
    let totalRepairTime = 0;

    repairs.forEach(repair => {
      deviceTypes[repair.deviceType] = (deviceTypes[repair.deviceType] || 0) + 1;
      priorityDist[repair.priority] = (priorityDist[repair.priority] || 0) + 1;

      if (repair.status === 'completed') {
        completedCount++;
        const cost = repair.finalCost || repair.estimatedCost || 0;
        totalCost += cost;

        if (repair.technicianName && repair.technicianId) {
          if (!technicianLoad[repair.technicianId]) {
            technicianLoad[repair.technicianId] = { count: 0, revenue: 0, name: repair.technicianName };
          }
          technicianLoad[repair.technicianId].count++;
          technicianLoad[repair.technicianId].revenue += cost;
        }

        if (repair.completedAt) {
          const month = new Date(repair.completedAt).toLocaleDateString('ru', { year: 'numeric', month: 'short' });
          monthlyRevenue[month] = (monthlyRevenue[month] || 0) + cost;

          const created = new Date(repair.createdAt).getTime();
          const completed = new Date(repair.completedAt).getTime();
          totalRepairTime += (completed - created);
        }
      }
    });

    const avgRepairTime = completedCount > 0 
      ? Math.round(totalRepairTime / completedCount / (1000 * 60 * 60 * 24) * 10) / 10 
      : 0;

    const avgCost = completedCount > 0 ? Math.round(totalCost / completedCount) : 0;

    const topDevices = Object.entries(deviceTypes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([device, count]) => ({ device, count }));

    const topTechnicians = Object.values(technicianLoad)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const successRate = repairs.length > 0 
      ? Math.round((completedCount / repairs.length) * 100) 
      : 0;

    return {
      totalCost,
      avgCost,
      avgRepairTime,
      completedCount,
      topDevices,
      priorityDist,
      topTechnicians,
      monthlyRevenue: Object.entries(monthlyRevenue).slice(-6),
      successRate
    };
  }, [repairs]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon name="TrendingUp" size={16} />
              Общий доход
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCost.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.completedCount} завершённых заявок
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon name="DollarSign" size={16} />
              Средний чек
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgCost.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground mt-1">
              На одну заявку
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon name="Clock" size={16} />
              Среднее время
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgRepairTime} дн.</div>
            <p className="text-xs text-muted-foreground mt-1">
              От создания до завершения
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon name="Target" size={16} />
              Успешность
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Завершённых заявок
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Icon name="Smartphone" size={18} />
              Популярные устройства
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topDevices.map((item, index) => {
                const total = repairs.length;
                const percentage = Math.round((item.count / total) * 100);
                
                return (
                  <div key={item.device} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-200 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium">{item.device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{item.count}</Badge>
                        <span className="text-xs text-muted-foreground w-12 text-right">{percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' :
                          'bg-primary'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {analytics.topDevices.length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Нет данных
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Icon name="Flag" size={18} />
              Распределение по приоритетам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center gap-2">
                  <Icon name="AlertTriangle" className="text-red-600" size={18} />
                  <span className="text-sm font-medium">Срочно</span>
                </div>
                <Badge variant="destructive">{analytics.priorityDist.urgent}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-100">
                <div className="flex items-center gap-2">
                  <Icon name="ArrowUp" className="text-orange-600" size={18} />
                  <span className="text-sm font-medium">Высокий</span>
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">{analytics.priorityDist.high}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2">
                  <Icon name="Minus" className="text-blue-600" size={18} />
                  <span className="text-sm font-medium">Средний</span>
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">{analytics.priorityDist.medium}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2">
                  <Icon name="ArrowDown" className="text-gray-600" size={18} />
                  <span className="text-sm font-medium">Низкий</span>
                </div>
                <Badge variant="outline">{analytics.priorityDist.low}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Icon name="Award" size={18} />
            Топ мастеров по доходу
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topTechnicians.map((tech, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-600 text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{tech.name}</div>
                  <div className="text-sm text-muted-foreground">{tech.count} заявок</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{tech.revenue.toLocaleString()} ₽</div>
                  <div className="text-xs text-muted-foreground">
                    ≈ {Math.round(tech.revenue / tech.count).toLocaleString()} ₽/заявка
                  </div>
                </div>
              </div>
            ))}
            {analytics.topTechnicians.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Нет данных
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
