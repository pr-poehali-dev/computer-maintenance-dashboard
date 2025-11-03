import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { ImportExportDialog } from "@/components/ImportExportDialog";
import { technicianService } from "@/services/technicianService";
import { repairService } from "@/services/repairService";
import { Technician, TechnicianStatus } from "@/types";
import { toast } from "sonner";

import { TechnicianFormDialog } from "./technicians/TechnicianFormDialog";
import { TechnicianStatsCards } from "./technicians/TechnicianStatsCards";
import { TechnicianDataTable } from "./technicians/TechnicianDataTable";
import { TechnicianDetailsDialog } from "./technicians/TechnicianDetailsDialog";

const TechniciansSection = () => {
  const [technicians, setTechnicians] = useState<Technician[]>(technicianService.getAll());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [viewMode, setViewMode] = useState<'active' | 'all'>('active');

  const repairs = repairService.getAll();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: [] as string[],
    status: "available" as TechnicianStatus,
    hourlyRate: 0,
    hireDate: new Date(),
    skills: "",
    certifications: "",
    notes: ""
  });

  const [specializationInput, setSpecializationInput] = useState("");

  const techsWithStats = useMemo(() => {
    return technicians.map(tech => {
      const techRepairs = repairs.filter(r => r.technicianId === tech.id);
      const activeRepairs = techRepairs.filter(r => 
        r.status === 'in_progress' || r.status === 'waiting_parts'
      ).length;
      const completedThisMonth = techRepairs.filter(r => {
        if (r.status !== 'completed' || !r.completedAt) return false;
        const completedDate = new Date(r.completedAt);
        const now = new Date();
        return completedDate.getMonth() === now.getMonth() && 
               completedDate.getFullYear() === now.getFullYear();
      }).length;
      
      const revenue = techRepairs
        .filter(r => r.status === 'completed' && r.finalCost)
        .reduce((sum, r) => sum + (r.finalCost || 0), 0);

      const avgRepairTime = tech.completedRepairs > 0
        ? techRepairs
            .filter(r => r.status === 'completed' && r.completedAt)
            .reduce((sum, r) => {
              const start = new Date(r.createdAt).getTime();
              const end = new Date(r.completedAt!).getTime();
              return sum + (end - start);
            }, 0) / tech.completedRepairs / (1000 * 60 * 60 * 24)
        : 0;

      const workload = activeRepairs / 5 * 100;

      return {
        ...tech,
        activeRepairs,
        completedThisMonth,
        revenue,
        avgRepairTime: Math.round(avgRepairTime * 10) / 10,
        workload: Math.min(Math.round(workload), 100)
      };
    });
  }, [technicians, repairs]);

  const filteredTechs = useMemo(() => {
    if (viewMode === 'active') {
      return techsWithStats.filter(t => t.status === 'available' || t.status === 'busy');
    }
    return techsWithStats;
  }, [techsWithStats, viewMode]);

  const stats = useMemo(() => {
    const active = technicians.filter(t => t.status === 'available' || t.status === 'busy').length;
    const available = technicians.filter(t => t.status === 'available').length;
    const busy = technicians.filter(t => t.status === 'busy').length;
    const onBreak = technicians.filter(t => t.status === 'on_break').length;
    
    const totalCompleted = technicians.reduce((sum, t) => sum + t.completedRepairs, 0);
    const avgRating = technicians.length > 0 
      ? (technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length).toFixed(1)
      : "0.0";
    
    const totalRevenue = techsWithStats.reduce((sum, t) => sum + t.revenue, 0);
    const totalWorkload = techsWithStats.reduce((sum, t) => sum + t.workload, 0) / (technicians.length || 1);

    const topPerformer = [...techsWithStats]
      .sort((a, b) => b.completedThisMonth - a.completedThisMonth)[0];

    return {
      total: technicians.length,
      active,
      available,
      busy,
      onBreak,
      totalCompleted,
      avgRating,
      totalRevenue,
      avgWorkload: Math.round(totalWorkload),
      topPerformer
    };
  }, [technicians, techsWithStats]);

  const handleCreate = () => {
    technicianService.create({
      ...formData,
      specialization: formData.specialization.length > 0 
        ? formData.specialization 
        : ["Общий ремонт"]
    });
    setTechnicians(technicianService.getAll());
    setIsCreateOpen(false);
    resetForm();
    toast.success('Техник добавлен');
  };

  const handleUpdate = () => {
    if (!editingTechnician) return;
    technicianService.update(editingTechnician.id, formData);
    setTechnicians(technicianService.getAll());
    setEditingTechnician(null);
    resetForm();
    toast.success('Техник обновлён');
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить техника? История его работы сохранится.")) {
      technicianService.delete(id);
      setTechnicians(technicianService.getAll());
      toast.success('Техник удалён');
    }
  };

  const handleQuickStatusChange = (tech: Technician, newStatus: TechnicianStatus) => {
    technicianService.update(tech.id, { status: newStatus });
    setTechnicians(technicianService.getAll());
    toast.success(`Статус изменён на ${getStatusLabel(newStatus)}`);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      specialization: [],
      status: "available",
      hourlyRate: 0,
      hireDate: new Date(),
      skills: "",
      certifications: "",
      notes: ""
    });
    setSpecializationInput("");
  };

  const openEdit = (technician: Technician) => {
    setEditingTechnician(technician);
    setFormData({
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      specialization: technician.specialization,
      status: technician.status,
      hourlyRate: technician.hourlyRate,
      hireDate: technician.hireDate,
      skills: (technician as any).skills || "",
      certifications: (technician as any).certifications || "",
      notes: (technician as any).notes || ""
    });
  };

  const addSpecialization = () => {
    if (specializationInput.trim() && !formData.specialization.includes(specializationInput.trim())) {
      setFormData({
        ...formData,
        specialization: [...formData.specialization, specializationInput.trim()]
      });
      setSpecializationInput("");
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData({
      ...formData,
      specialization: formData.specialization.filter((_, i) => i !== index)
    });
  };

  const getStatusLabel = (status: TechnicianStatus) => {
    const labels: Record<TechnicianStatus, string> = {
      available: "Доступен",
      busy: "Занят",
      on_break: "На перерыве",
      off_duty: "Не на смене"
    };
    return labels[status];
  };

  const getStatusBadge = (status: TechnicianStatus) => {
    const variants: Record<TechnicianStatus, any> = {
      available: { variant: "outline", color: "text-green-600 bg-green-50 border-green-200" },
      busy: { variant: "default", color: "text-orange-600 bg-orange-50 border-orange-200" },
      on_break: { variant: "secondary", color: "text-blue-600 bg-blue-50 border-blue-200" },
      off_duty: { variant: "secondary", color: "text-gray-600 bg-gray-50 border-gray-200" }
    };
    const config = variants[status];
    return <Badge variant={config.variant} className={config.color}>{getStatusLabel(status)}</Badge>;
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 80) return 'bg-red-500';
    if (workload >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Техники</h2>
          <p className="text-muted-foreground">Управление техническим персоналом и нагрузкой</p>
        </div>
        <div className="flex gap-2">
          <ImportExportDialog 
            data={technicians} 
            onImport={(data) => {
              data.forEach(item => technicianService.create(item));
              setTechnicians(technicianService.getAll());
            }}
            entity="technicians"
          />
          <Button onClick={() => setIsCreateOpen(true)}>
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить техника
          </Button>
        </div>
      </div>

      <TechnicianStatsCards stats={stats} />

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <TabsList>
          <TabsTrigger value="active">Активные ({stats.active})</TabsTrigger>
          <TabsTrigger value="all">Все ({stats.total})</TabsTrigger>
        </TabsList>

        <TabsContent value={viewMode} className="mt-6">
          <Card>
            <TechnicianDataTable
              technicians={filteredTechs}
              onEdit={openEdit}
              onDelete={handleDelete}
              onViewDetails={setSelectedTechnician}
              onStatusChange={handleQuickStatusChange}
              getStatusBadge={getStatusBadge}
              getWorkloadColor={getWorkloadColor}
            />
          </Card>
        </TabsContent>
      </Tabs>

      <TechnicianFormDialog
        isOpen={isCreateOpen || !!editingTechnician}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingTechnician(null);
          }
        }}
        editingTechnician={editingTechnician}
        formData={formData}
        setFormData={setFormData}
        specializationInput={specializationInput}
        setSpecializationInput={setSpecializationInput}
        onSubmit={editingTechnician ? handleUpdate : handleCreate}
        onCancel={() => {
          setIsCreateOpen(false);
          setEditingTechnician(null);
          resetForm();
        }}
        addSpecialization={addSpecialization}
        removeSpecialization={removeSpecialization}
      />

      <TechnicianDetailsDialog
        isOpen={!!selectedTechnician}
        onOpenChange={(open) => !open && setSelectedTechnician(null)}
        technician={selectedTechnician}
        repairs={repairs}
        getStatusBadge={getStatusBadge}
        onEdit={() => {
          if (selectedTechnician) {
            openEdit(selectedTechnician);
            setSelectedTechnician(null);
          }
        }}
      />
    </div>
  );
};

export default TechniciansSection;
