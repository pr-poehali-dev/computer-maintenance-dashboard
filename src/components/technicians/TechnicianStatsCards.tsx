import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface TechnicianStatsCardsProps {
  stats: {
    total: number;
    active: number;
    available: number;
    busy: number;
    onBreak: number;
    totalCompleted: number;
    avgRating: string;
    totalRevenue: number;
    avgWorkload: number;
    topPerformer: any;
  };
}

export const TechnicianStatsCards = ({ stats }: TechnicianStatsCardsProps) => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего техников
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              На смене: {stats.active}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Статус техников
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Доступны:</span>
                <span className="font-semibold">{stats.available}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-600">Заняты:</span>
                <span className="font-semibold">{stats.busy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">На перерыве:</span>
                <span className="font-semibold">{stats.onBreak}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Выполнено работ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Средний рейтинг: {stats.avgRating}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Общий доход
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₽{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Загрузка: {stats.avgWorkload}%
            </p>
          </CardContent>
        </Card>
      </div>

      {stats.topPerformer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Лучший техник месяца</CardTitle>
            <CardDescription>Наивысшие показатели за текущий месяц</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon name="Award" className="text-yellow-500" size={24} />
                  <span className="text-xl font-bold">{stats.topPerformer.name}</span>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Завершено: {stats.topPerformer.completedThisMonth}</span>
                  <span>Рейтинг: {stats.topPerformer.rating.toFixed(1)}</span>
                  <span>Доход: ₽{stats.topPerformer.revenue.toLocaleString()}</span>
                </div>
              </div>
              <Badge variant="default" className="bg-yellow-500">
                <Icon name="Star" size={16} className="mr-1" />
                TOP
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
