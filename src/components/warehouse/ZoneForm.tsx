import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WarehouseZone } from "@/types";

interface ZoneFormData {
  name: string;
  capacity: number;
  currentLoad: number;
  temperature: number;
  humidity: number;
  location: string;
  responsible: string;
}

interface ZoneFormProps {
  formData: ZoneFormData;
  setFormData: (data: ZoneFormData) => void;
  editingZone: WarehouseZone | null;
  onSubmit: () => void;
}

export const ZoneForm = ({ formData, setFormData, editingZone, onSubmit }: ZoneFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Название зоны</Label>
        <Input 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          placeholder="Зона А - Комплектующие" 
        />
      </div>

      <div>
        <Label>Расположение</Label>
        <Input 
          value={formData.location} 
          onChange={(e) => setFormData({...formData, location: e.target.value})} 
          placeholder="Склад 1, стеллаж 5" 
        />
      </div>

      <div>
        <Label>Ответственный</Label>
        <Input 
          value={formData.responsible} 
          onChange={(e) => setFormData({...formData, responsible: e.target.value})} 
          placeholder="ФИО сотрудника" 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Вместимость (единиц)</Label>
          <Input 
            type="number"
            min="0"
            value={formData.capacity} 
            onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} 
          />
        </div>
        <div>
          <Label>Текущая загрузка</Label>
          <Input 
            type="number"
            min="0"
            value={formData.currentLoad} 
            onChange={(e) => setFormData({...formData, currentLoad: Number(e.target.value)})} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Температура (°C)</Label>
          <Input 
            type="number"
            value={formData.temperature} 
            onChange={(e) => setFormData({...formData, temperature: Number(e.target.value)})} 
          />
        </div>
        <div>
          <Label>Влажность (%)</Label>
          <Input 
            type="number"
            min="0"
            max="100"
            value={formData.humidity} 
            onChange={(e) => setFormData({...formData, humidity: Number(e.target.value)})} 
          />
        </div>
      </div>
      
      <Button onClick={onSubmit} className="w-full">
        {editingZone ? "Сохранить изменения" : "Создать зону"}
      </Button>
    </div>
  );
};
