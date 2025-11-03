import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { WarehouseZone } from "@/types";

interface ZonesTabProps {
  zones: WarehouseZone[];
  onEdit: (zone: WarehouseZone) => void;
  onDelete: (id: string) => void;
}

export const ZonesTab = ({ zones, onEdit, onDelete }: ZonesTabProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {zones.map((zone) => {
        const utilization = zone.capacity > 0 
          ? Math.round((zone.currentLoad / zone.capacity) * 100) 
          : 0;
        
        return (
          <Card key={zone.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{zone.name}</CardTitle>
                  {(zone as any).location && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <Icon name="MapPin" className="h-3 w-3 inline mr-1" />
                      {(zone as any).location}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(zone)}
                  >
                    <Icon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(zone.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Заполненность</span>
                  <Badge variant={utilization > 80 ? "destructive" : utilization > 60 ? "secondary" : "outline"}>
                    {utilization}%
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      utilization > 80 ? 'bg-red-500' : 
                      utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${utilization}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>{zone.currentLoad} единиц</span>
                  <span>из {zone.capacity}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Icon name="Thermometer" className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Температура</div>
                    <div className="font-medium">{zone.temperature}°C</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Icon name="Droplets" className="h-4 w-4 text-cyan-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Влажность</div>
                    <div className="font-medium">{zone.humidity}%</div>
                  </div>
                </div>
              </div>

              {(zone as any).responsible && (
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="User" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ответственный:</span>
                  <span className="font-medium">{(zone as any).responsible}</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {zones.length === 0 && (
        <Card className="col-span-full">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Icon name="Package" className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Нет складских зон</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
