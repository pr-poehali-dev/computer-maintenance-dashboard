import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Technician, TechnicianStatus } from "@/types";

interface TechnicianWithStats extends Technician {
  activeRepairs: number;
  completedThisMonth: number;
  revenue: number;
  avgRepairTime: number;
  workload: number;
}

interface TechnicianDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  technician: TechnicianWithStats | null;
  repairs: any[];
  getStatusBadge: (status: TechnicianStatus) => JSX.Element;
  onEdit: () => void;
}

export const TechnicianDetailsDialog = ({
  isOpen,
  onOpenChange,
  technician,
  repairs,
  getStatusBadge,
  onEdit
}: TechnicianDetailsDialogProps) => {
  if (!technician) return null;

  const techRepairs = repairs.filter(r => r.technicianId === technician.id);
  const recentRepairs = techRepairs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{technician.name}</DialogTitle>
              <div className="flex gap-2 mt-2">
                {getStatusBadge(technician.status)}
                <Badge variant="outline">
                  <Icon name="Star" size={14} className="mr-1 text-yellow-500" />
                  {technician.rating.toFixed(1)}
                </Badge>
              </div>
            </div>
            <Button onClick={onEdit}>
              <Icon name="Edit" size={16} className="mr-2" />
              Редактировать
            </Button>
          </div>
        </DialogHeader>

        <div className="grid gap-6 mt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Активные заявки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{technician.activeRepairs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">За месяц</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{technician.completedThisMonth}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Всего завершено</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{technician.completedRepairs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Доход</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₽{technician.revenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Icon name="Phone" size={18} className="text-muted-foreground" />
                <span>{technician.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Mail" size={18} className="text-muted-foreground" />
                <span>{technician.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="DollarSign" size={18} className="text-muted-foreground" />
                <span>Почасовая ставка: ₽{technician.hourlyRate}/час</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Calendar" size={18} className="text-muted-foreground" />
                <span>Дата найма: {new Date(technician.hireDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Специализация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technician.specialization.map((spec, idx) => (
                  <Badge key={idx} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {((technician as any).skills || (technician as any).certifications) && (
            <div className="grid gap-4 md:grid-cols-2">
              {(technician as any).skills && (
                <Card>
                  <CardHeader>
                    <CardTitle>Навыки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{(technician as any).skills}</p>
                  </CardContent>
                </Card>
              )}

              {(technician as any).certifications && (
                <Card>
                  <CardHeader>
                    <CardTitle>Сертификаты</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{(technician as any).certifications}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Последние работы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentRepairs.map((repair) => (
                  <div key={repair.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex-1">
                      <div className="font-medium">{repair.deviceType} {repair.deviceModel}</div>
                      <div className="text-sm text-muted-foreground">{repair.clientName}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(repair.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {recentRepairs.length === 0 && (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    Нет завершённых работ
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
