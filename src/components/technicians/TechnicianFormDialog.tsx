import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Technician, TechnicianStatus } from "@/types";

interface TechnicianFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTechnician: Technician | null;
  formData: {
    name: string;
    email: string;
    phone: string;
    specialization: string[];
    status: TechnicianStatus;
    hourlyRate: number;
    hireDate: Date;
    skills: string;
    certifications: string;
    notes: string;
  };
  setFormData: (data: any) => void;
  specializationInput: string;
  setSpecializationInput: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  addSpecialization: () => void;
  removeSpecialization: (index: number) => void;
}

export const TechnicianFormDialog = ({
  isOpen,
  onOpenChange,
  editingTechnician,
  formData,
  setFormData,
  specializationInput,
  setSpecializationInput,
  onSubmit,
  onCancel,
  addSpecialization,
  removeSpecialization
}: TechnicianFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTechnician ? "Редактировать техника" : "Добавить техника"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="main">Основное</TabsTrigger>
            <TabsTrigger value="work">Работа</TabsTrigger>
            <TabsTrigger value="additional">Дополнительно</TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">ФИО *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Иванов Иван Иванович"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tech@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Специализация</Label>
              <div className="flex gap-2">
                <Input
                  value={specializationInput}
                  onChange={(e) => setSpecializationInput(e.target.value)}
                  placeholder="Например: iPhone"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                />
                <Button type="button" onClick={addSpecialization}>
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specialization.map((spec, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {spec}
                    <button 
                      type="button"
                      onClick={() => removeSpecialization(idx)}
                      className="ml-1 hover:text-destructive"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="work" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value as TechnicianStatus })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Доступен</SelectItem>
                    <SelectItem value="busy">Занят</SelectItem>
                    <SelectItem value="on_break">На перерыве</SelectItem>
                    <SelectItem value="off_duty">Не на смене</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Почасовая ставка (₽)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Дата найма</Label>
              <Input
                id="hireDate"
                type="date"
                value={formData.hireDate ? new Date(formData.hireDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, hireDate: new Date(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Навыки</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Пайка, диагностика, замена экранов..."
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="additional" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certifications">Сертификаты</Label>
              <Textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                placeholder="Apple Certified, Samsung Certified..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Заметки</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Дополнительная информация..."
                rows={4}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button onClick={onSubmit}>
            {editingTechnician ? "Сохранить" : "Добавить"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
