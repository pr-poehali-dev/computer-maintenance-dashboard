import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface AnalyticsTabProps {
  stats: {
    totalInQuantity: number;
    totalOutQuantity: number;
    totalInValue: number;
    totalOutValue: number;
    mostActiveItem: string;
  };
}

export const AnalyticsTab = ({ stats }: AnalyticsTabProps) => {
  const balance = stats.totalInValue - stats.totalOutValue;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Общий приход</CardTitle>
          <Icon name="ArrowDownLeft" className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalInQuantity}</div>
          <p className="text-xs text-muted-foreground mt-1">
            на сумму ₽{stats.totalInValue.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Общий расход</CardTitle>
          <Icon name="ArrowUpRight" className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalOutQuantity}</div>
          <p className="text-xs text-muted-foreground mt-1">
            на сумму ₽{stats.totalOutValue.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Баланс</CardTitle>
          <Icon name="TrendingUp" className={`h-5 w-5 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {balance >= 0 ? '+' : ''}₽{balance.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalInQuantity - stats.totalOutQuantity} единиц
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Самый активный товар</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Icon name="TrendingUp" className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold">{stats.mostActiveItem}</div>
              <p className="text-sm text-muted-foreground">
                По количеству операций прихода и расхода
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
