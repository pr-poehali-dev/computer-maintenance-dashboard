import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { ImportExportDialog } from "@/components/ImportExportDialog";
import { repairService } from "@/services/repairService";
import { clientService } from "@/services/clientService";
import { technicianService } from "@/services/technicianService";
import { Repair, RepairStatus, Priority } from "@/types";
import { toast } from "sonner";

import { RepairStats } from "./repairs/RepairStats";
import { RepairFilters } from "./repairs/RepairFilters";
import { RepairCard } from "./repairs/RepairCard";
import { RepairForm } from "./repairs/RepairForm";
import { RepairDetails } from "./repairs/RepairDetails";
import { RepairTimeline } from "./repairs/RepairTimeline";
import { RepairKanban } from "./repairs/RepairKanban";
import { RepairAnalytics } from "./repairs/RepairAnalytics";

const RepairsSection = () => {
  const [repairs, setRepairs] = useState<Repair[]>(repairService.getAll());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState<Repair | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'timeline' | 'analytics'>('list');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RepairStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [technicianFilter, setTechnicianFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt-desc');

  const clients = clientService.getAll();
  const technicians = technicianService.getAll();

  const filteredAndSortedRepairs = useMemo(() => {
    let result = repairs;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.clientName.toLowerCase().includes(query) ||
        r.deviceType.toLowerCase().includes(query) ||
        r.deviceModel.toLowerCase().includes(query) ||
        r.problem.toLowerCase().includes(query) ||
        (r.technicianName && r.technicianName.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter(r => r.priority === priorityFilter);
    }

    if (technicianFilter === 'unassigned') {
      result = result.filter(r => !r.technicianId);
    } else if (technicianFilter !== 'all') {
      result = result.filter(r => r.technicianId === technicianFilter);
    }

    const [sortField, sortOrder] = sortBy.split('-');
    result = [...result].sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortField) {
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aVal = priorityOrder[a.priority];
          bVal = priorityOrder[b.priority];
          break;
        case 'cost':
          aVal = a.finalCost || a.estimatedCost || 0;
          bVal = b.finalCost || b.estimatedCost || 0;
          break;
        case 'estimatedDays':
          aVal = a.estimatedDays || 0;
          bVal = b.estimatedDays || 0;
          break;
        default:
          return 0;
      }

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [repairs, searchQuery, statusFilter, priorityFilter, technicianFilter, sortBy]);

  const handleCreate = (data: any) => {
    const client = clients.find(c => c.id === data.clientId);
    const technician = technicians.find(t => t.id === data.technicianId);

    repairService.create({
      ...data,
      clientName: client?.name || "",
      technicianName: technician?.name,
      finalCost: data.status === 'completed' ? data.finalCost : undefined,
      completedAt: data.status === 'completed' ? new Date().toISOString() : undefined
    });

    setRepairs(repairService.getAll());
    setIsCreateOpen(false);
    toast.success('Заявка создана');
  };

  const handleUpdate = (data: any) => {
    if (!editingRepair) return;

    const client = clients.find(c => c.id === data.clientId);
    const technician = technicians.find(t => t.id === data.technicianId);

    const wasCompleted = editingRepair.status === 'completed';
    const isNowCompleted = data.status === 'completed';

    repairService.update(editingRepair.id, {
      ...data,
      clientName: client?.name || "",
      technicianName: technician?.name,
      completedAt: isNowCompleted && !wasCompleted ? new Date().toISOString() : editingRepair.completedAt
    });

    setRepairs(repairService.getAll());
    setEditingRepair(null);
    toast.success('Заявка обновлена');
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить заявку?")) {
      repairService.delete(id);
      setRepairs(repairService.getAll());
      setSelectedRepair(null);
      toast.success('Заявка удалена');
    }
  };

  const handleStatusChange = (repairId: string, newStatus: RepairStatus) => {
    const repair = repairs.find(r => r.id === repairId);
    if (!repair) return;

    const wasCompleted = repair.status === 'completed';
    const isNowCompleted = newStatus === 'completed';

    repairService.update(repairId, {
      status: newStatus,
      completedAt: isNowCompleted && !wasCompleted ? new Date().toISOString() : repair.completedAt
    });

    setRepairs(repairService.getAll());
    toast.success(`Статус изменён`);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter('all');
    setPriorityFilter('all');
    setTechnicianFilter('all');
    setSortBy('createdAt-desc');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Icon name="Wrench" size={32} />
            Управление ремонтами
          </h2>
          <p className="text-muted-foreground">
            Полный контроль над заявками, статистика и аналитика
          </p>
        </div>
        
        <div className="flex gap-2">
          <ImportExportDialog 
            data={repairs} 
            onImport={(data) => {
              data.forEach(item => repairService.create(item));
              setRepairs(repairService.getAll());
            }}
            entity="repairs"
          />
          <Button onClick={() => setIsCreateOpen(true)} size="lg">
            <Icon name="Plus" size={18} className="mr-2" />
            Новая заявка
          </Button>
        </div>
      </div>

      <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
        <TabsList>
          <TabsTrigger value="today">Сегодня</TabsTrigger>
          <TabsTrigger value="week">Неделя</TabsTrigger>
          <TabsTrigger value="month">Месяц</TabsTrigger>
        </TabsList>
      </Tabs>

      <RepairStats repairs={repairs} timeRange={timeRange} />

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="list">
            <Icon name="List" size={16} className="mr-2" />
            Список
          </TabsTrigger>
          <TabsTrigger value="kanban">
            <Icon name="LayoutGrid" size={16} className="mr-2" />
            Канбан
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Icon name="Activity" size={16} className="mr-2" />
            Лента
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Icon name="BarChart3" size={16} className="mr-2" />
            Аналитика
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <RepairFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            technicianFilter={technicianFilter}
            onTechnicianFilterChange={setTechnicianFilter}
            technicians={technicians.map(t => ({ id: t.id, name: t.name }))}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={resetFilters}
            resultsCount={filteredAndSortedRepairs.length}
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedRepairs.map(repair => (
              <RepairCard
                key={repair.id}
                repair={repair}
                onView={(r) => setSelectedRepair(r)}
                onEdit={(r) => {
                  setEditingRepair(r);
                }}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {filteredAndSortedRepairs.length === 0 && (
            <div className="text-center py-12">
              <Icon name="FileX" size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Заявок не найдено</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? "Попробуйте изменить фильтры"
                  : "Создайте первую заявку на ремонт"}
              </p>
              {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all') && (
                <Button variant="outline" onClick={resetFilters}>
                  <Icon name="X" size={16} className="mr-2" />
                  Сбросить фильтры
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="kanban">
          <RepairKanban
            repairs={filteredAndSortedRepairs}
            onRepairClick={(r) => setSelectedRepair(r)}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="timeline">
          <RepairTimeline repairs={filteredAndSortedRepairs} limit={20} />
        </TabsContent>

        <TabsContent value="analytics">
          <RepairAnalytics repairs={repairs} />
        </TabsContent>
      </Tabs>

      <RepairForm
        open={isCreateOpen || !!editingRepair}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingRepair(null);
          }
        }}
        repair={editingRepair}
        clients={clients.map(c => ({ id: c.id, name: c.name, phone: c.phone }))}
        technicians={technicians.map(t => ({ id: t.id, name: t.name, specialization: t.specialization }))}
        onSubmit={editingRepair ? handleUpdate : handleCreate}
        onCancel={() => {
          setIsCreateOpen(false);
          setEditingRepair(null);
        }}
      />

      <RepairDetails
        open={!!selectedRepair}
        onOpenChange={(open) => !open && setSelectedRepair(null)}
        repair={selectedRepair}
        onEdit={() => {
          if (selectedRepair) {
            setEditingRepair(selectedRepair);
            setSelectedRepair(null);
          }
        }}
        onStatusChange={(status) => {
          if (selectedRepair) {
            handleStatusChange(selectedRepair.id, status as RepairStatus);
            setSelectedRepair({ ...selectedRepair, status: status as RepairStatus });
          }
        }}
      />
    </div>
  );
};

export default RepairsSection;
