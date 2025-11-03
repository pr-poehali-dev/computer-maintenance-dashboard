import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Repair, RepairStatus, Priority } from "@/types";

interface RepairFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repair?: Repair | null;
  clients: Array<{ id: string; name: string; phone: string }>;
  technicians: Array<{ id: string; name: string; specialization: string[] }>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const RepairForm = ({
  open,
  onOpenChange,
  repair,
  clients,
  technicians,
  onSubmit,
  onCancel
}: RepairFormProps) => {
  const [formData, setFormData] = useState({
    clientId: "",
    deviceType: "",
    deviceModel: "",
    serialNumber: "",
    problem: "",
    diagnosis: "",
    status: "new" as RepairStatus,
    priority: "medium" as Priority,
    technicianId: "",
    estimatedCost: 0,
    estimatedDays: 1,
    notes: "",
    accessories: "",
    finalCost: 0
  });

  useEffect(() => {
    if (repair) {
      setFormData({
        clientId: repair.clientId,
        deviceType: repair.deviceType,
        deviceModel: repair.deviceModel,
        serialNumber: repair.serialNumber || "",
        problem: repair.problem,
        diagnosis: repair.diagnosis || "",
        status: repair.status,
        priority: repair.priority,
        technicianId: repair.technicianId || "",
        estimatedCost: repair.estimatedCost || 0,
        estimatedDays: repair.estimatedDays || 1,
        notes: repair.notes || "",
        accessories: repair.accessories || "",
        finalCost: repair.finalCost || 0
      });
    } else {
      setFormData({
        clientId: "",
        deviceType: "",
        deviceModel: "",
        serialNumber: "",
        problem: "",
        diagnosis: "",
        status: "new",
        priority: "medium",
        technicianId: "",
        estimatedCost: 0,
        estimatedDays: 1,
        notes: "",
        accessories: "",
        finalCost: 0
      });
    }
  }, [repair]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name={repair ? "Edit" : "Plus"} size={20} />
            {repair ? "Редактировать заявку" : "Создать заявку на ремонт"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="main">Основное</TabsTrigger>
              <TabsTrigger value="technical">Технические</TabsTrigger>
              <TabsTrigger value="additional">Дополнительно</TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientId">
                    <Icon name="User" size={14} className="inline mr-1" />
                    Клиент *
                  </Label>
                  <Select value={formData.clientId} onValueChange={(v) => updateField('clientId', v)} required>
                    <SelectTrigger id="clientId">
                      <SelectValue placeholder="Выберите клиента" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} ({client.phone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technicianId">
                    <Icon name="UserCog" size={14} className="inline mr-1" />
                    Мастер
                  </Label>
                  <Select value={formData.technicianId} onValueChange={(v) => updateField('technicianId', v)}>
                    <SelectTrigger id="technicianId">
                      <SelectValue placeholder="Выберите мастера" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Не назначен</SelectItem>
                      {technicians.map(tech => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name} - {tech.specialization.join(', ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deviceType">
                    <Icon name="Smartphone" size={14} className="inline mr-1" />
                    Тип устройства *
                  </Label>
                  <Input
                    id="deviceType"
                    value={formData.deviceType}
                    onChange={(e) => updateField('deviceType', e.target.value)}
                    placeholder="Смартфон, ноутбук, планшет..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deviceModel">
                    <Icon name="Info" size={14} className="inline mr-1" />
                    Модель *
                  </Label>
                  <Input
                    id="deviceModel"
                    value={formData.deviceModel}
                    onChange={(e) => updateField('deviceModel', e.target.value)}
                    placeholder="iPhone 14 Pro, MacBook Air M2..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">
                  <Icon name="Hash" size={14} className="inline mr-1" />
                  Серийный номер / IMEI
                </Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => updateField('serialNumber', e.target.value)}
                  placeholder="Введите серийный номер"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem">
                  <Icon name="AlertCircle" size={14} className="inline mr-1" />
                  Проблема *
                </Label>
                <Textarea
                  id="problem"
                  value={formData.problem}
                  onChange={(e) => updateField('problem', e.target.value)}
                  placeholder="Опишите проблему клиента..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">
                  <Icon name="FileSearch" size={14} className="inline mr-1" />
                  Диагноз
                </Label>
                <Textarea
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => updateField('diagnosis', e.target.value)}
                  placeholder="Результаты диагностики..."
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">
                    <Icon name="Activity" size={14} className="inline mr-1" />
                    Статус
                  </Label>
                  <Select value={formData.status} onValueChange={(v) => updateField('status', v as RepairStatus)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Новая</SelectItem>
                      <SelectItem value="in_progress">В работе</SelectItem>
                      <SelectItem value="waiting_parts">Ожидание деталей</SelectItem>
                      <SelectItem value="completed">Завершено</SelectItem>
                      <SelectItem value="cancelled">Отменено</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">
                    <Icon name="Flag" size={14} className="inline mr-1" />
                    Приоритет
                  </Label>
                  <Select value={formData.priority} onValueChange={(v) => updateField('priority', v as Priority)}>
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Срочно</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="low">Низкий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">
                    <Icon name="DollarSign" size={14} className="inline mr-1" />
                    Оценка стоимости
                  </Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    min="0"
                    value={formData.estimatedCost}
                    onChange={(e) => updateField('estimatedCost', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finalCost">
                    <Icon name="DollarSign" size={14} className="inline mr-1" />
                    Итоговая стоимость
                  </Label>
                  <Input
                    id="finalCost"
                    type="number"
                    min="0"
                    value={formData.finalCost}
                    onChange={(e) => updateField('finalCost', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedDays">
                    <Icon name="Clock" size={14} className="inline mr-1" />
                    Срок (дней)
                  </Label>
                  <Input
                    id="estimatedDays"
                    type="number"
                    min="1"
                    value={formData.estimatedDays}
                    onChange={(e) => updateField('estimatedDays', Number(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="accessories">
                  <Icon name="Package" size={14} className="inline mr-1" />
                  Комплектация
                </Label>
                <Textarea
                  id="accessories"
                  value={formData.accessories}
                  onChange={(e) => updateField('accessories', e.target.value)}
                  placeholder="Зарядка, чехол, наушники..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">
                  <Icon name="FileText" size={14} className="inline mr-1" />
                  Заметки
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Дополнительная информация..."
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              <Icon name="X" size={16} className="mr-2" />
              Отмена
            </Button>
            <Button type="submit">
              <Icon name={repair ? "Save" : "Plus"} size={16} className="mr-2" />
              {repair ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
