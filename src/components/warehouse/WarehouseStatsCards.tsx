import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface WarehouseStatsCardsProps {
  stats: {
    totalItems: number;
    totalCapacity: number;
    utilizationRate: number;
    inMovements: number;
    outMovements: number;
    totalInValue: number;
    totalOutValue: number;
  };
}

export const WarehouseStatsCards = ({ stats }: WarehouseStatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">На складе</CardTitle>
          <Icon name="Package" className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalItems}</div>
          <p className="text-xs text-muted-foreground mt-1">из {stats.totalCapacity} возможных</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Заполненность</CardTitle>
          <Icon name="TrendingUp" className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.utilizationRate}%</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                stats.utilizationRate > 80 ? 'bg-red-500' : 
                stats.utilizationRate > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${stats.utilizationRate}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Приход</CardTitle>
          <Icon name="ArrowDownLeft" className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.inMovements}</div>
          <p className="text-xs text-muted-foreground mt-1">на сумму ₽{stats.totalInValue.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Расход</CardTitle>
          <Icon name="ArrowUpRight" className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.outMovements}</div>
          <p className="text-xs text-muted-foreground mt-1">на сумму ₽{stats.totalOutValue.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
};
