import { Plus, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reservation, ReservationStatus, ReservationChannel } from '@/types/reservations.types';
import { RESERVATION_FILTERS, ReservationFilter } from '@/constants/reservations.constants';

interface ReservationsListProps {
  reservations: Reservation[];
  activeFilter: ReservationFilter;
  onFilterChange: (filter: ReservationFilter) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  counts: Record<ReservationFilter, number>;
}

const formatFCFA = (value: number) => {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

// Styles pastel pixel-perfect conformes à la maquette Figma
const STATUS_BADGE_STYLES: Record<ReservationStatus, string> = {
  Nouvelle: 'bg-blue-50 text-blue-600',
  Confirmée: 'bg-emerald-50 text-emerald-600',
  Préparée: 'bg-amber-50 text-amber-600',
  Retirée: 'bg-gray-100 text-gray-500',
  Annulée: 'bg-rose-50 text-rose-600',
};

export function ReservationsList({
  reservations,
  activeFilter,
  onFilterChange,
  selectedId,
  onSelect,
  counts
}: ReservationsListProps) {
  const pendingCount = counts['Nouvelles'] || 0;

  return (
    <div className="flex flex-col h-full bg-white/88 border-r border-border-card w-[400px] flex-shrink-0 select-none">
      {/* En-tête & Filtres */}
      <div className="p-5 border-b border-border-card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-gray-900">Réservations</h2>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-full text-[12px] font-semibold transition-all active:scale-95 shadow-sm">
            <Plus size={14} strokeWidth={2.5} />
            Nouvelle
          </button>
        </div>

        {/* Filtres Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {RESERVATION_FILTERS.map((filter) => {
            const count = counts[filter] || 0;
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-brand-primary text-white font-semibold"
                    : "bg-[#F2F5F3] border border-[#E1E7E3] text-[#5A6862] hover:bg-[#E7ECE9]"
                )}
              >
                {filter}
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-medium",
                  isActive ? "bg-white/20 text-white" : "bg-[#E2E7E4] text-[#5A6862]"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bannière d'information */}
      {pendingCount > 0 && (
        <div className="px-5 pt-4 pb-1">
          <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-4xl p-2.5 flex items-center gap-2.5">
            <Smartphone size={14} strokeWidth={2} className='text-blue-700' />
            <span className="text-[12px] font-medium text-blue-700">
              {pendingCount} réservation{pendingCount > 1 ? 's' : ''} app en attente de confirmation
            </span>
          </div>
        </div>
      )}

      {/* Liste des cartes */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pt-3 flex flex-col gap-2.5">
        {reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-[13px] font-medium">
            Aucune réservation trouvée.
          </div>
        ) : (
          reservations.map((res) => {
            const isSelected = res.id === selectedId;
            const itemsSummary = res.items
              .map(item => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`)
              .join(', ');

            return (
              <button
                key={res.id}
                onClick={() => onSelect(res.id)}
                className={cn(
                  "flex flex-col p-3.5 rounded-2xl border text-left transition-all relative",
                  isSelected
                    ? "border-brand-primary/25 bg-[#F0FDF4]/60 shadow-xs"
                    : "border-gray-200/80 bg-white hover:border-gray-300 hover:shadow-2xs"
                )}
              >
                {/* Ligne 1 : Nom + Badges */}
                <div className="flex items-start justify-between w-full">
                  <span className="text-[12px] font-bold text-gray-900 leading-tight">
                    {res.customer.firstName} {res.customer.lastName}
                  </span>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {res.channel === 'App' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 flex items-center gap-1">
                        <Smartphone size={10} strokeWidth={2} />
                        App
                      </span>
                    )}
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-medium",
                      STATUS_BADGE_STYLES[res.status]
                    )}>
                      {res.status}
                    </span>
                  </div>
                </div>

                {/* Ligne 2 : Référence */}
                <span className="text-[10px] font-normal text-gray-400 mt-0.5 mb-2">
                  {res.reference}
                </span>

                {/* Ligne 3 : Médicaments résumés */}
                <div className="text-[11px] font-normal text-gray-600 line-clamp-1 mb-2.5">
                  {itemsSummary}
                </div>

                {/* Ligne 4 : Heure & Prix Total */}
                <div className="flex items-center justify-between w-full pt-1 border-t border-gray-100/60 mt-auto">
                  <span className="text-[11px] font-normal text-gray-400">
                    {formatTime(res.createdAt)}
                  </span>
                  <span className="text-[12px] font-bold text-gray-900">
                    {formatFCFA(res.totalAmount)}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}