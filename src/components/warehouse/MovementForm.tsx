import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { WarehouseZone, InventoryItem } from "@/types";

interface MovementFormData {
  itemId: string;
  quantity: number;
  type: "in" | "out";
  fromZone: string;
  toZone: string;
  reason: string;
  date: Date;
  cost: number;
  supplier: string;
  documentNumber: string;
}

interface MovementFormProps {
  formData: MovementFormData;
  setFormData: (data: MovementFormData) => void;
  items: InventoryItem[];
  zones: WarehouseZone[];
  onSubmit: () => void;
}

export const MovementForm = ({ formData, setFormData, items, zones, onSubmit }: MovementFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Тип операции</Label>
        <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val as "in" | "out"})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in">
              <div className="flex items-center gap-2">
                <Icon name="ArrowDownLeft" className="h-4 w-4 text-green-600" />
                Приход
              </div>
            </SelectItem>
            <SelectItem value="out">
              <div className="flex items-center gap-2">
                <Icon name="ArrowUpRight" className="h-4 w-4 text-red-600" />
                Расход
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Товар</Label>
        <Select value={formData.itemId} onValueChange={(val) => setFormData({...formData, itemId: val})}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите товар" />
          </SelectTrigger>
          <SelectContent>
            {items.map(item => (
              <SelectItem key={item.id} value={item.id}>
                {item.name} (Остаток: {item.quantity} {item.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Количество</Label>
          <Input 
            type="number"
            min="1"
            value={formData.quantity} 
            onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})} 
          />
        </div>
        <div>
          <Label>Цена за единицу</Label>
          <Input 
            type="number"
            min="0"
            value={formData.cost} 
            onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})} 
            placeholder="0"
          />
        </div>
      </div>
      
      {formData.type === "out" && (
        <div>
          <Label>Откуда</Label>
          <Select value={formData.fromZone} onValueChange={(val) => setFormData({...formData, fromZone: val})}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите зону" />
            </SelectTrigger>
            <SelectContent>
              {zones.map(zone => (
                <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {formData.type === "in" && (
        <>
          <div>
            <Label>Куда</Label>
            <Select value={formData.toZone} onValueChange={(val) => setFormData({...formData, toZone: val})}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите зону" />
              </SelectTrigger>
              <SelectContent>
                {zones.map(zone => (
                  <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Поставщик</Label>
            <Input 
              value={formData.supplier} 
              onChange={(e) => setFormData({...formData, supplier: e.target.value})} 
              placeholder="Название поставщика" 
            />
          </div>
        </>
      )}
      
      <div>
        <Label>Номер документа</Label>
        <Input 
          value={formData.documentNumber} 
          onChange={(e) => setFormData({...formData, documentNumber: e.target.value})} 
          placeholder="Накладная, счет..." 
        />
      </div>
      
      <div>
        <Label>Причина</Label>
        <Textarea 
          value={formData.reason} 
          onChange={(e) => setFormData({...formData, reason: e.target.value})} 
          placeholder="Поступление от поставщика, выдача на ремонт..." 
          rows={3}
        />
      </div>
      
      <div>
        <Label>Дата</Label>
        <Input 
          type="date"
          value={formData.date.toISOString().split('T')[0]} 
          onChange={(e) => setFormData({...formData, date: new Date(e.target.value)})} 
        />
      </div>

      {formData.quantity > 0 && formData.cost > 0 && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Общая сумма</div>
          <div className="text-2xl font-bold">
            ₽{(formData.quantity * formData.cost).toLocaleString()}
          </div>
        </div>
      )}
      
      <Button onClick={onSubmit} className="w-full">
        {formData.type === 'in' ? 'Оформить приход' : 'Оформить расход'}
      </Button>
    </div>
  );
};
