import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { RepairStatus, Priority } from "@/types";

interface RepairFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: RepairStatus | 'all';
  onStatusFilterChange: (value: RepairStatus | 'all') => void;
  priorityFilter: Priority | 'all';
  onPriorityFilterChange: (value: Priority | 'all') => void;
  technicianFilter: string;
  onTechnicianFilterChange: (value: string) => void;
  technicians: Array<{ id: string; name: string }>;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset?: () => void;
  resultsCount?: number;
}

export const RepairFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  technicianFilter,
  onTechnicianFilterChange,
  technicians,
  sortBy,
  onSortChange,
  onReset,
  resultsCount
}: RepairFiltersProps) => {
  const hasActiveFilters = 
    searchQuery || 
    statusFilter !== 'all' || 
    priorityFilter !== 'all' || 
    technicianFilter !== 'all' ||
    sortBy !== 'createdAt-desc';

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Поиск по клиенту, устройству, проблеме..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            {hasActiveFilters && onReset && (
              <Button variant="outline" size="icon" onClick={onReset}>
                <Icon name="X" size={18} />
              </Button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="new">
                  <div className="flex items-center gap-2">
                    <Icon name="FileText" size={14} />
                    Новые
                  </div>
                </SelectItem>
                <SelectItem value="in_progress">
                  <div className="flex items-center gap-2">
                    <Icon name="Wrench" size={14} />
                    В работе
                  </div>
                </SelectItem>
                <SelectItem value="waiting_parts">
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={14} />
                    Ожидание
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle" size={14} />
                    Завершено
                  </div>
                </SelectItem>
                <SelectItem value="cancelled">
                  <div className="flex items-center gap-2">
                    <Icon name="XCircle" size={14} />
                    Отменено
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Приоритет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все приоритеты</SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <Icon name="AlertTriangle" size={14} className="text-red-600" />
                    Срочно
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <Icon name="ArrowUp" size={14} className="text-orange-600" />
                    Высокий
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <Icon name="Minus" size={14} className="text-blue-600" />
                    Средний
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <Icon name="ArrowDown" size={14} className="text-gray-600" />
                    Низкий
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={technicianFilter} onValueChange={onTechnicianFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Мастер" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все мастера</SelectItem>
                <SelectItem value="unassigned">
                  <div className="flex items-center gap-2">
                    <Icon name="UserX" size={14} />
                    Не назначен
                  </div>
                </SelectItem>
                {technicians.map(tech => (
                  <SelectItem key={tech.id} value={tech.id}>
                    <div className="flex items-center gap-2">
                      <Icon name="UserCog" size={14} />
                      {tech.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Сначала новые</SelectItem>
                <SelectItem value="createdAt-asc">Сначала старые</SelectItem>
                <SelectItem value="priority-desc">По приоритету ↓</SelectItem>
                <SelectItem value="cost-desc">По стоимости ↓</SelectItem>
                <SelectItem value="cost-asc">По стоимости ↑</SelectItem>
                <SelectItem value="estimatedDays-asc">По срокам ↑</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-md">
              <span className="text-sm text-muted-foreground">Найдено:</span>
              <Badge variant="secondary">{resultsCount || 0}</Badge>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Активные фильтры:</span>
              {searchQuery && (
                <Badge variant="outline" className="gap-1">
                  <Icon name="Search" size={12} />
                  {searchQuery}
                  <button onClick={() => onSearchChange('')} className="ml-1">
                    <Icon name="X" size={12} />
                  </button>
                </Badge>
              )}
              {statusFilter !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  Статус: {statusFilter}
                  <button onClick={() => onStatusFilterChange('all')} className="ml-1">
                    <Icon name="X" size={12} />
                  </button>
                </Badge>
              )}
              {priorityFilter !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  Приоритет: {priorityFilter}
                  <button onClick={() => onPriorityFilterChange('all')} className="ml-1">
                    <Icon name="X" size={12} />
                  </button>
                </Badge>
              )}
              {technicianFilter !== 'all' && technicianFilter !== 'unassigned' && (
                <Badge variant="outline" className="gap-1">
                  Мастер: {technicians.find(t => t.id === technicianFilter)?.name}
                  <button onClick={() => onTechnicianFilterChange('all')} className="ml-1">
                    <Icon name="X" size={12} />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
