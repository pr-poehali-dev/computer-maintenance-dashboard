import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { Repair } from "@/types";
import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface RepairDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repair: Repair | null;
  onEdit?: () => void;
  onStatusChange?: (status: string) => void;
}

const statusConfig = {
  new: { variant: "secondary" as const, label: "Новая", icon: "FileText" },
  in_progress: { variant: "default" as const, label: "В работе", icon: "Wrench" },
  waiting_parts: { variant: "outline" as const, label: "Ожидание деталей", icon: "Clock" },
  completed: { variant: "outline" as const, label: "Завершено", icon: "CheckCircle" },
  cancelled: { variant: "destructive" as const, label: "Отменено", icon: "XCircle" }
};

const priorityConfig = {
  urgent: { color: "text-red-600", bg: "bg-red-50", label: "Срочно", icon: "AlertTriangle" },
  high: { color: "text-orange-600", bg: "bg-orange-50", label: "Высокий", icon: "ArrowUp" },
  medium: { color: "text-blue-600", bg: "bg-blue-50", label: "Средний", icon: "Minus" },
  low: { color: "text-gray-600", bg: "bg-gray-50", label: "Низкий", icon: "ArrowDown" }
};

export const RepairDetails = ({ open, onOpenChange, repair, onEdit, onStatusChange }: RepairDetailsProps) => {
  if (!repair) return null;

  const status = statusConfig[repair.status] || statusConfig.new;
  const priority = priorityConfig[repair.priority] || priorityConfig.medium;

  const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string | number | null | undefined }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon name={icon} className="text-muted-foreground mt-0.5 flex-shrink-0" size={18} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground mb-0.5">{label}</p>
        <p className="font-medium">{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl mb-2">
                {repair.deviceType} {repair.deviceModel}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={status.variant} className="flex items-center gap-1">
                  <Icon name={status.icon} size={14} />
                  {status.label}
                </Badge>
                <Badge className={`${priority.bg} ${priority.color} border-0 flex items-center gap-1`}>
                  <Icon name={priority.icon} size={14} />
                  {priority.label}
                </Badge>
              </div>
            </div>
            {onEdit && (
              <Button onClick={onEdit} variant="outline">
                <Icon name="Edit" size={16} className="mr-2" />
                Редактировать
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="grid gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Info" size={18} />
                Основная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1">
              <DetailRow icon="User" label="Клиент" value={repair.clientName} />
              <DetailRow icon="UserCog" label="Мастер" value={repair.technicianName || "Не назначен"} />
              <DetailRow icon="Smartphone" label="Устройство" value={`${repair.deviceType} ${repair.deviceModel}`} />
              <DetailRow icon="Hash" label="Серийный номер" value={repair.serialNumber} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="AlertCircle" size={18} />
                Проблема и диагностика
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Icon name="AlertCircle" size={14} />
                  Описание проблемы
                </p>
                <p className="text-base">{repair.problem}</p>
              </div>
              {repair.diagnosis && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Icon name="FileSearch" size={14} />
                      Диагноз
                    </p>
                    <p className="text-base">{repair.diagnosis}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="DollarSign" size={18} />
                  Стоимость и сроки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Оценка</p>
                    <p className="text-2xl font-bold">{repair.estimatedCost || 0} ₽</p>
                  </div>
                  {repair.finalCost && repair.finalCost > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Итого</p>
                      <p className="text-2xl font-bold text-green-600">{repair.finalCost} ₽</p>
                    </div>
                  )}
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Срок выполнения</p>
                  <p className="text-lg font-medium">{repair.estimatedDays || 1} {repair.estimatedDays === 1 ? 'день' : 'дней'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calendar" size={18} />
                  Временная линия
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Icon name="Plus" size={14} />
                    Создано
                  </p>
                  <p className="font-medium">{format(new Date(repair.createdAt), "d MMMM yyyy, HH:mm", { locale: ru })}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(repair.createdAt), { addSuffix: true, locale: ru })}
                  </p>
                </div>
                {repair.completedAt && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                        <Icon name="CheckCircle" size={14} />
                        Завершено
                      </p>
                      <p className="font-medium">{format(new Date(repair.completedAt), "d MMMM yyyy, HH:mm", { locale: ru })}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(repair.completedAt), { addSuffix: true, locale: ru })}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {(repair.accessories || repair.notes) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="FileText" size={18} />
                  Дополнительная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {repair.accessories && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Icon name="Package" size={14} />
                      Комплектация
                    </p>
                    <p className="text-base">{repair.accessories}</p>
                  </div>
                )}
                {repair.notes && (
                  <>
                    {repair.accessories && <Separator />}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <Icon name="FileText" size={14} />
                        Заметки
                      </p>
                      <p className="text-base">{repair.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {onStatusChange && repair.status !== 'completed' && repair.status !== 'cancelled' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Activity" size={18} />
                  Быстрая смена статуса
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {repair.status !== 'in_progress' && (
                    <Button onClick={() => onStatusChange('in_progress')} variant="outline" size="sm">
                      <Icon name="Wrench" size={14} className="mr-2" />
                      В работу
                    </Button>
                  )}
                  {repair.status !== 'waiting_parts' && (
                    <Button onClick={() => onStatusChange('waiting_parts')} variant="outline" size="sm">
                      <Icon name="Clock" size={14} className="mr-2" />
                      Ожидание деталей
                    </Button>
                  )}
                  <Button onClick={() => onStatusChange('completed')} variant="default" size="sm">
                    <Icon name="CheckCircle" size={14} className="mr-2" />
                    Завершить
                  </Button>
                  <Button onClick={() => onStatusChange('cancelled')} variant="destructive" size="sm">
                    <Icon name="XCircle" size={14} className="mr-2" />
                    Отменить
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
