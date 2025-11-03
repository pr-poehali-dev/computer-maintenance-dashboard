import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { StockMovement } from "@/types";

interface MovementsTabProps {
  movements: StockMovement[];
  dateFilter: string;
  setDateFilter: (date: string) => void;
  typeFilter: "" | "in" | "out";
  setTypeFilter: (type: "" | "in" | "out") => void;
  onDelete: (id: string) => void;
}

export const MovementsTab = ({
  movements,
  dateFilter,
  setDateFilter,
  typeFilter,
  setTypeFilter,
  onDelete
}: MovementsTabProps) => {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Дата</Label>
            <Input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label>Тип операции</Label>
            <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val as "" | "in" | "out")}>
              <SelectTrigger>
                <SelectValue placeholder="Все операции" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все операции</SelectItem>
                <SelectItem value="in">Приход</SelectItem>
                <SelectItem value="out">Расход</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(dateFilter || typeFilter) && (
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => { setDateFilter(""); setTypeFilter(""); }}
              >
                Сбросить
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-2">
        {movements.map((movement) => (
          <Card key={movement.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {movement.type === 'in' ? (
                      <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
                        <Icon name="ArrowDownLeft" className="h-3 w-3 mr-1" />
                        Приход
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">
                        <Icon name="ArrowUpRight" className="h-3 w-3 mr-1" />
                        Расход
                      </Badge>
                    )}
                    <span className="font-semibold">{movement.itemName}</span>
                    <span className="text-muted-foreground">× {movement.quantity}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Calendar" className="h-3 w-3" />
                      {movement.date.toLocaleDateString()}
                    </div>
                    {movement.supplier && (
                      <div className="flex items-center gap-1">
                        <Icon name="Truck" className="h-3 w-3" />
                        {movement.supplier}
                      </div>
                    )}
                    {movement.documentNumber && (
                      <div className="flex items-center gap-1">
                        <Icon name="FileText" className="h-3 w-3" />
                        {movement.documentNumber}
                      </div>
                    )}
                    {movement.cost && (
                      <div className="flex items-center gap-1">
                        <Icon name="DollarSign" className="h-3 w-3" />
                        ₽{(movement.cost * movement.quantity).toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  {movement.reason && (
                    <p className="text-sm mt-2 text-muted-foreground">{movement.reason}</p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(movement.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Icon name="Trash2" className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {movements.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Icon name="PackageOpen" className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Нет движений товаров</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
