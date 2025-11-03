import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { warehouseService } from "@/services/warehouseService";
import { inventoryService } from "@/services/inventoryService";
import { WarehouseZone, StockMovement } from "@/types";
import { toast } from "sonner";

import { WarehouseStatsCards } from "./warehouse/WarehouseStatsCards";
import { MovementForm } from "./warehouse/MovementForm";
import { ZoneForm } from "./warehouse/ZoneForm";
import { MovementsTab } from "./warehouse/MovementsTab";
import { ZonesTab } from "./warehouse/ZonesTab";
import { AnalyticsTab } from "./warehouse/AnalyticsTab";

const WarehouseSection = () => {
  const [zones, setZones] = useState<WarehouseZone[]>(warehouseService.getAllZones());
  const [movements, setMovements] = useState<StockMovement[]>(warehouseService.getAllMovements());
  const [activeTab, setActiveTab] = useState<"movements" | "zones" | "analytics">("movements");
  const [isCreateMovementOpen, setIsCreateMovementOpen] = useState(false);
  const [isCreateZoneOpen, setIsCreateZoneOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<WarehouseZone | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<"" | "in" | "out">("");

  const items = inventoryService.getAll();

  const [movementFormData, setMovementFormData] = useState({
    itemId: "",
    quantity: 0,
    type: "in" as "in" | "out",
    fromZone: "",
    toZone: "",
    reason: "",
    date: new Date(),
    cost: 0,
    supplier: "",
    documentNumber: ""
  });

  const [zoneFormData, setZoneFormData] = useState({
    name: "",
    capacity: 0,
    currentLoad: 0,
    temperature: 20,
    humidity: 50,
    location: "",
    responsible: ""
  });

  const warehouseStats = useMemo(() => {
    const totalItems = zones.reduce((sum, zone) => sum + zone.currentLoad, 0);
    const totalCapacity = zones.reduce((sum, zone) => sum + zone.capacity, 0);
    const utilizationRate = totalCapacity > 0 ? Math.round((totalItems / totalCapacity) * 100) : 0;
    
    const filteredMovements = movements.filter(m => {
      if (dateFilter) {
        const moveDate = m.date.toISOString().split('T')[0];
        if (moveDate !== dateFilter) return false;
      }
      if (typeFilter && m.type !== typeFilter) return false;
      return true;
    });

    const inMovements = filteredMovements.filter(m => m.type === "in");
    const outMovements = filteredMovements.filter(m => m.type === "out");
    
    const totalInQuantity = inMovements.reduce((sum, m) => sum + m.quantity, 0);
    const totalOutQuantity = outMovements.reduce((sum, m) => sum + m.quantity, 0);
    
    const totalInValue = inMovements.reduce((sum, m) => sum + (m.cost || 0) * m.quantity, 0);
    const totalOutValue = outMovements.reduce((sum, m) => sum + (m.cost || 0) * m.quantity, 0);

    const movementsByItem: { [key: string]: { in: number; out: number; name: string } } = {};
    movements.forEach(m => {
      if (!movementsByItem[m.itemId]) {
        movementsByItem[m.itemId] = { in: 0, out: 0, name: m.itemName };
      }
      if (m.type === 'in') {
        movementsByItem[m.itemId].in += m.quantity;
      } else {
        movementsByItem[m.itemId].out += m.quantity;
      }
    });

    const mostActiveItem = Object.entries(movementsByItem)
      .sort((a, b) => (b[1].in + b[1].out) - (a[1].in + a[1].out))[0];

    return {
      totalItems,
      totalCapacity,
      utilizationRate,
      inMovements: inMovements.length,
      outMovements: outMovements.length,
      totalInQuantity,
      totalOutQuantity,
      totalInValue,
      totalOutValue,
      mostActiveItem: mostActiveItem ? mostActiveItem[1].name : '-',
      filteredMovements
    };
  }, [zones, movements, dateFilter, typeFilter]);

  const handleCreateMovement = () => {
    const item = items.find(i => i.id === movementFormData.itemId);
    if (!item) {
      toast.error("Выберите товар");
      return;
    }

    if (movementFormData.quantity <= 0) {
      toast.error("Количество должно быть больше 0");
      return;
    }

    warehouseService.createMovement({
      ...movementFormData,
      itemName: item.name
    });

    if (movementFormData.type === "out") {
      inventoryService.update(item.id, {
        quantity: item.quantity - movementFormData.quantity
      });
    } else {
      inventoryService.update(item.id, {
        quantity: item.quantity + movementFormData.quantity
      });
    }

    setMovements(warehouseService.getAllMovements());
    setIsCreateMovementOpen(false);
    resetMovementForm();
    toast.success(`${movementFormData.type === 'in' ? 'Приход' : 'Расход'} зарегистрирован`);
  };

  const handleCreateZone = () => {
    if (!zoneFormData.name) {
      toast.error("Введите название зоны");
      return;
    }

    warehouseService.createZone(zoneFormData);
    setZones(warehouseService.getAllZones());
    setIsCreateZoneOpen(false);
    resetZoneForm();
    toast.success("Зона создана");
  };

  const handleUpdateZone = () => {
    if (!editingZone) return;
    warehouseService.updateZone(editingZone.id, zoneFormData);
    setZones(warehouseService.getAllZones());
    setEditingZone(null);
    resetZoneForm();
    toast.success("Зона обновлена");
  };

  const handleDeleteZone = (id: string) => {
    if (confirm("Удалить зону?")) {
      warehouseService.deleteZone(id);
      setZones(warehouseService.getAllZones());
      toast.success("Зона удалена");
    }
  };

  const handleDeleteMovement = (id: string) => {
    if (confirm("Удалить движение?")) {
      warehouseService.deleteMovement(id);
      setMovements(warehouseService.getAllMovements());
      toast.success("Движение удалено");
    }
  };

  const resetMovementForm = () => {
    setMovementFormData({
      itemId: "",
      quantity: 0,
      type: "in",
      fromZone: "",
      toZone: "",
      reason: "",
      date: new Date(),
      cost: 0,
      supplier: "",
      documentNumber: ""
    });
  };

  const resetZoneForm = () => {
    setZoneFormData({
      name: "",
      capacity: 0,
      currentLoad: 0,
      temperature: 20,
      humidity: 50,
      location: "",
      responsible: ""
    });
  };

  const openEditZone = (zone: WarehouseZone) => {
    setEditingZone(zone);
    setZoneFormData({
      name: zone.name,
      capacity: zone.capacity,
      currentLoad: zone.currentLoad,
      temperature: zone.temperature || 20,
      humidity: zone.humidity || 50,
      location: (zone as any).location || "",
      responsible: (zone as any).responsible || ""
    });
    setIsCreateZoneOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Склад</h2>
          <p className="text-muted-foreground">Учет движения товаров и управление складскими зонами</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateZoneOpen} onOpenChange={(open) => {
            setIsCreateZoneOpen(open);
            if (!open) {
              setEditingZone(null);
              resetZoneForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Icon name="Package" className="h-4 w-4" />
                Создать зону
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingZone ? "Редактировать зону" : "Новая складская зона"}</DialogTitle>
              </DialogHeader>
              <ZoneForm
                formData={zoneFormData}
                setFormData={setZoneFormData}
                editingZone={editingZone}
                onSubmit={editingZone ? handleUpdateZone : handleCreateZone}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateMovementOpen} onOpenChange={setIsCreateMovementOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={resetMovementForm}>
                <Icon name="Plus" className="h-4 w-4" />
                Приход/расход
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Новое движение товара</DialogTitle>
              </DialogHeader>
              <MovementForm
                formData={movementFormData}
                setFormData={setMovementFormData}
                items={items}
                zones={zones}
                onSubmit={handleCreateMovement}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <WarehouseStatsCards stats={warehouseStats} />

      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "movements" ? "default" : "ghost"}
          onClick={() => setActiveTab("movements")}
        >
          <Icon name="Activity" className="h-4 w-4 mr-2" />
          Движения
        </Button>
        <Button
          variant={activeTab === "zones" ? "default" : "ghost"}
          onClick={() => setActiveTab("zones")}
        >
          <Icon name="Package" className="h-4 w-4 mr-2" />
          Зоны ({zones.length})
        </Button>
        <Button
          variant={activeTab === "analytics" ? "default" : "ghost"}
          onClick={() => setActiveTab("analytics")}
        >
          <Icon name="BarChart3" className="h-4 w-4 mr-2" />
          Аналитика
        </Button>
      </div>

      {activeTab === "movements" && (
        <MovementsTab
          movements={warehouseStats.filteredMovements}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          onDelete={handleDeleteMovement}
        />
      )}

      {activeTab === "zones" && (
        <ZonesTab
          zones={zones}
          onEdit={openEditZone}
          onDelete={handleDeleteZone}
        />
      )}

      {activeTab === "analytics" && (
        <AnalyticsTab stats={warehouseStats} />
      )}
    </div>
  );
};

export default WarehouseSection;
