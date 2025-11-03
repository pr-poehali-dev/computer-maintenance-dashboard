import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Repair } from "@/types";
import { useMemo } from "react";

interface RepairStatsProps {
  repairs: Repair[];
  timeRange?: 'today' | 'week' | 'month';
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  iconBg?: string;
  iconColor?: string;
  subtitle?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendUp, 
  iconBg = "bg-primary/10", 
  iconColor = "text-primary",
  subtitle
}: StatCardProps) => (
  <Card className="hover:shadow-md transition-all">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className={`h-10 w-10 rounded-lg ${iconBg} flex items-center justify-center`}>
        <Icon name={icon} className={`h-5 w-5 ${iconColor}`} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      {trend && (
        <p className={`text-xs flex items-center gap-1 mt-1 font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          <Icon name={trendUp ? "TrendingUp" : "TrendingDown"} className="h-3 w-3" />
          {trend}
        </p>
      )}
    </CardContent>
  </Card>
);

export const RepairStats = ({ repairs, timeRange = 'today' }: RepairStatsProps) => {
  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const filterDate = timeRange === 'today' ? todayStart : timeRange === 'week' ? weekStart : monthStart;
    const filteredRepairs = repairs.filter(r => new Date(r.createdAt) >= filterDate);

    const newRepairs = repairs.filter(r => r.status === "new").length;
    const inProgress = repairs.filter(r => r.status === "in_progress").length;
    const waitingParts = repairs.filter(r => r.status === "waiting_parts").length;
    const completed = repairs.filter(r => r.status === "completed").length;
    const urgent = repairs.filter(r => r.priority === "urgent" && r.status !== "completed").length;
    const active = newRepairs + inProgress + waitingParts;

    const completedToday = filteredRepairs.filter(r => r.status === "completed").length;
    const completedLastPeriod = repairs.filter(r => {
      const date = new Date(r.createdAt);
      const prevPeriodStart = new Date(filterDate.getTime() - (now.getTime() - filterDate.getTime()));
      return date >= prevPeriodStart && date < filterDate && r.status === 'completed';
    }).length;
    
    const completedTrend = completedLastPeriod > 0 
      ? `${Math.round(((completedToday - completedLastPeriod) / completedLastPeriod) * 100)}%`
      : '+100%';

    const revenueToday = filteredRepairs
      .filter(r => r.status === "completed" && r.finalCost)
      .reduce((sum, r) => sum + (r.finalCost || 0), 0);

    const prevRevenue = repairs.filter(r => {
      const date = new Date(r.createdAt);
      const prevPeriodStart = new Date(filterDate.getTime() - (now.getTime() - filterDate.getTime()));
      return date >= prevPeriodStart && date < filterDate && r.status === 'completed' && r.finalCost;
    }).reduce((sum, r) => sum + (r.finalCost || 0), 0);

    const revenueTrend = prevRevenue > 0 
      ? `${Math.round(((revenueToday - prevRevenue) / prevRevenue) * 100)}%`
      : '+100%';

    const totalRevenue = repairs
      .filter(r => r.status === "completed" && r.finalCost)
      .reduce((sum, r) => sum + (r.finalCost || 0), 0);

    const avgRepairTime = completed > 0 
      ? Math.round(repairs
          .filter(r => r.status === "completed" && r.completedAt)
          .reduce((sum, r) => {
            const created = new Date(r.createdAt).getTime();
            const completedTime = new Date(r.completedAt!).getTime();
            return sum + (completedTime - created);
          }, 0) / completed / (1000 * 60 * 60 * 24) * 10) / 10
      : 0;

    return {
      new: newRepairs,
      inProgress,
      waitingParts,
      completed,
      urgent,
      active,
      completedToday,
      completedTrend,
      completedTrendUp: completedToday >= completedLastPeriod,
      revenueToday,
      revenueTrend,
      revenueTrendUp: revenueToday >= prevRevenue,
      totalRevenue,
      avgRepairTime
    };
  }, [repairs, timeRange]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Активные заявки" 
        value={stats.active} 
        icon="Wrench" 
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        subtitle={`${stats.new} новых, ${stats.inProgress} в работе`}
      />
      <StatCard 
        title="Завершено" 
        value={stats.completedToday} 
        icon="CheckCircle" 
        trend={stats.completedTrend}
        trendUp={stats.completedTrendUp}
        iconBg="bg-green-100"
        iconColor="text-green-600"
        subtitle={`Всего: ${stats.completed}`}
      />
      <StatCard 
        title="Доход" 
        value={`${stats.revenueToday.toLocaleString()} ₽`} 
        icon="DollarSign" 
        trend={stats.revenueTrend}
        trendUp={stats.revenueTrendUp}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        subtitle={`Всего: ${stats.totalRevenue.toLocaleString()} ₽`}
      />
      <StatCard 
        title="Срочные" 
        value={stats.urgent} 
        icon="AlertTriangle" 
        iconBg="bg-red-100"
        iconColor="text-red-600"
        subtitle={`Ожидают деталей: ${stats.waitingParts}`}
      />
      
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-base">Детальная статистика</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-100">
              <div className="flex items-center gap-2">
                <Icon name="FileText" className="text-purple-600" size={18} />
                <span className="text-sm font-medium">Новые</span>
              </div>
              <Badge variant="secondary">{stats.new}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-2">
                <Icon name="Wrench" className="text-blue-600" size={18} />
                <span className="text-sm font-medium">В работе</span>
              </div>
              <Badge variant="default">{stats.inProgress}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-100">
              <div className="flex items-center gap-2">
                <Icon name="Clock" className="text-yellow-600" size={18} />
                <span className="text-sm font-medium">Ожидание</span>
              </div>
              <Badge variant="outline">{stats.waitingParts}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2">
                <Icon name="Timer" className="text-gray-600" size={18} />
                <span className="text-sm font-medium">Ср. время</span>
              </div>
              <span className="text-sm font-bold">{stats.avgRepairTime} дн.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
