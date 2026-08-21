import { Pill, AlertTriangle, Info, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reservation, ReservationStatus } from '@/types/reservations.types';
import { ReservationStepper } from './ReservationStepper';

interface ReservationDetailProps {
  reservation: Reservation | null;
  onUpdateStatus: (id: string, newStatus: ReservationStatus) => void;
}

const formatFCFA = (value: number) => {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const STATUS_BADGE_STYLES: Record<ReservationStatus, string> = {
  Nouvelle: 'bg-blue-50 text-blue-600',
  Confirmée: 'bg-emerald-50 text-emerald-600',
  Préparée: 'bg-amber-50 text-amber-600',
  Retirée: 'bg-gray-100 text-gray-500',
  Annulée: 'bg-rose-50 text-rose-600',
};

export function ReservationDetail({ reservation, onUpdateStatus }: ReservationDetailProps) {
  if (!reservation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-2 text-gray-400 bg-[#FAFAFA]">
        <CalendarCheck size={32} strokeWidth={1.5} className="text-gray-300" />
        <p className="text-[13px] font-medium text-gray-400">Sélectionnez une réservation</p>
      </div>
    );
  }

  const statusStyle = STATUS_BADGE_STYLES[reservation.status];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const renderActions = () => {
    switch (reservation.status) {
      case 'Nouvelle':
        return (
          <div className="flex items-center gap-2.5 mt-1">
            <button
              onClick={() => onUpdateStatus(reservation.id, 'Confirmée')}
              className="flex-1 bg-brand-primary hover:bg-brand-primary/80 text-white py-2.5 rounded-lg text-[12px] font-semibold shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={15} strokeWidth={2.5} />
              Confirmer
            </button>
            <button
              onClick={() => onUpdateStatus(reservation.id, 'Annulée')}
              className="px-4 py-2.5 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold transition-transform active:scale-[0.98]"
            >
              Annuler
            </button>
          </div>
        );
      case 'Confirmée':
        return (
          <div className="flex items-center gap-2.5 mt-1">
            <button
              onClick={() => onUpdateStatus(reservation.id, 'Préparée')}
              className="flex-1 bg-[#0D7A5F] hover:bg-[#0B6851] text-white py-2.5 rounded-lg text-[12px] font-semibold shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={15} strokeWidth={2.5} />
              Marquer Préparée
            </button>
            <button
              onClick={() => onUpdateStatus(reservation.id, 'Annulée')}
              className="px-4 py-2.5 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold transition-transform active:scale-[0.98]"
            >
              Annuler
            </button>
          </div>
        );
      case 'Préparée':
        return (
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onUpdateStatus(reservation.id, 'Retirée')}
                className="flex-1 bg-[#0D7A5F] hover:bg-[#0B6851] text-white py-2.5 rounded-lg text-[12px] font-semibold shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={15} strokeWidth={2.5} />
                Marquer Retirée
              </button>
              <button
                onClick={() => onUpdateStatus(reservation.id, 'Annulée')}
                className="px-4 py-2.5 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold transition-transform active:scale-[0.98]"
              >
                Annuler
              </button>
            </div>
            <div className="flex items-start gap-2 text-[11px] font-medium text-[#C2410C] bg-[#FFF7ED] p-3 rounded-lg border border-[#FFEDD5]">
              <AlertTriangle size={14} className="text-[#F97316] mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">Les articles de cette réservation doivent être mis de côté pour éviter toute vente accidentelle.</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-background-secondary overflow-y-auto no-scrollbar flex flex-col">
      <div className="w-full max-w-[500px] py-4 px-5 mt-5 mx-5 flex flex-col gap-5">
        <div className="flex items-start justify-between mb-0.5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-bold text-gray-900 leading-none">
                {reservation.customer.firstName} {reservation.customer.lastName}
              </h1>
              {reservation.channel === 'App' && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-blue-50 text-blue-600 flex items-center gap-1">
                  <svg width="8" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                  Réservation app
                </span>
              )}
            </div>
            <div className="text-[11px] font-medium text-gray-400">
              {reservation.reference} - {formatDate(reservation.createdAt)}
            </div>
          </div>
          <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium", statusStyle)}>
            {reservation.status}
          </span>
        </div>

        {/* Stepper Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm overflow-hidden">
          <ReservationStepper currentStatus={reservation.status} />

          {/* Alerte Annulation */}
          {reservation.status === 'Annulée' && (
            <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              <Info size={14} className="text-red-500 flex-shrink-0" />
              <span><strong>Réservation annulée</strong> - {reservation.alert || "Client ne s'est pas présenté"}</span>
            </div>
          )}
        </div>

        {/* Info Client */}
        <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#0D7A5F] flex items-center justify-center text-white font-bold text-[13px]">
            {getInitials(reservation.customer.firstName, reservation.customer.lastName)}
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-900 leading-snug">
              {reservation.customer.firstName} {reservation.customer.lastName}
            </span>
            <span className="text-[11px] font-medium text-gray-400">
              {reservation.customer.phone}
            </span>
          </div>
        </div>

        {/* Médicaments Réservés */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Médicaments réservés</h3>
          </div>
          <div className="flex flex-col">
            {reservation.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-50/60 flex items-center justify-center border border-emerald-100/40">
                    <Pill size={12} className="text-[#0D7A5F]" />
                  </div>
                  <span className="text-[12px] font-semibold text-gray-800">{item.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[11px] font-medium text-gray-400">x{item.quantity}</span>
                  <span className="text-[12px] font-bold text-gray-900 w-[65px] text-right">{formatFCFA(item.price)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-gray-50/50 flex items-center justify-between mt-auto border-t border-gray-100">
            <span className="text-[12px] font-bold text-gray-800">Total</span>
            <span className="text-[14px] font-bold text-[#0D7A5F]">{formatFCFA(reservation.totalAmount)}</span>
          </div>
        </div>

        {/* Note Client */}
        {reservation.note && (
          <div className="bg-[#FFF9F0] border border-[#FFE8CC] rounded-xl p-3">
            <h3 className="text-[9px] font-bold text-[#F59E0B] uppercase tracking-wider mb-1">Note Client</h3>
            <p className="text-[12px] font-semibold text-[#D97706] leading-relaxed">{reservation.note}</p>
          </div>
        )}

        {/* Actions Dynamiques */}
        {renderActions()}

      </div>
    </div>
  );
}