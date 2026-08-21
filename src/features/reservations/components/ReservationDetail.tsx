import { Pill, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reservation, ReservationStatus } from '@/types/reservations.types';
import { RESERVATION_STATUS_COLORS, RESERVATION_CHANNEL_STYLES } from '@/constants/reservations.constants';
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

export function ReservationDetail({ reservation, onUpdateStatus }: ReservationDetailProps) {
  if (!reservation) {
    return (
      <div className="flex-1 bg-background flex flex-col items-center justify-center text-text-muted">
        <p className="text-[14px] font-medium">Sélectionnez une réservation pour voir les détails</p>
      </div>
    );
  }

  const statusStyle = RESERVATION_STATUS_COLORS[reservation.status];
  const channelStyle = RESERVATION_CHANNEL_STYLES[reservation.channel];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const renderActions = () => {
    switch (reservation.status) {
      case 'Nouvelle':
        return (
          <div className="flex items-center gap-3 mt-6">
            <button 
              onClick={() => onUpdateStatus(reservation.id, 'Confirmée')}
              className="flex-1 bg-brand-primary text-white py-3.5 rounded-xl text-[14px] font-bold shadow-button-primary transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Confirmer
            </button>
            <button 
              onClick={() => onUpdateStatus(reservation.id, 'Annulée')}
              className="px-6 py-3.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-[14px] font-bold transition-transform active:scale-[0.98] hover:bg-red-100"
            >
              Annuler
            </button>
          </div>
        );
      case 'Confirmée':
        return (
          <div className="flex items-center gap-3 mt-6">
            <button 
              onClick={() => onUpdateStatus(reservation.id, 'Préparée')}
              className="flex-1 bg-brand-primary text-white py-3.5 rounded-xl text-[14px] font-bold shadow-button-primary transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Marquer Préparée
            </button>
            <button 
              onClick={() => onUpdateStatus(reservation.id, 'Annulée')}
              className="px-6 py-3.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-[14px] font-bold transition-transform active:scale-[0.98] hover:bg-red-100"
            >
              Annuler
            </button>
          </div>
        );
      case 'Préparée':
        return (
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onUpdateStatus(reservation.id, 'Retirée')}
                className="flex-1 bg-brand-primary text-white py-3.5 rounded-xl text-[14px] font-bold shadow-button-primary transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Marquer Retirée
              </button>
              <button 
                onClick={() => onUpdateStatus(reservation.id, 'Annulée')}
                className="px-6 py-3.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-[14px] font-bold transition-transform active:scale-[0.98] hover:bg-red-100"
              >
                Annuler
              </button>
            </div>
            <div className="flex items-start gap-2 text-[12px] font-medium text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-100">
              <AlertTriangle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
              <span>Les articles de cette réservation doivent être mis de côté pour éviter toute vente accidentelle.</span>
            </div>
          </div>
        );
      default:
        return null; // Retirée or Annulée have no actions
    }
  };

  return (
    <div className="flex-1 bg-background overflow-y-auto no-scrollbar flex flex-col items-center">
      <div className="w-full max-w-[760px] py-8 px-6 flex flex-col gap-6">
        
        {/* Header Fiche */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-bold text-text-foreground">
                {reservation.customer.firstName} {reservation.customer.lastName}
              </h1>
              <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-transparent", channelStyle.bg, channelStyle.text)}>
                {reservation.channel === 'App' ? (
                  <svg width="8" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                ) : null}
                {reservation.channel === 'App' ? 'Réservation app' : 'Comptoir'}
              </span>
            </div>
            <div className="text-[13px] font-medium text-text-muted">
              {reservation.reference} - {formatDate(reservation.createdAt)}
            </div>
          </div>
          <span className={cn("px-4 py-1.5 rounded-full text-[12px] font-bold border", statusStyle.bg, statusStyle.text, statusStyle.border)}>
            {reservation.status}
          </span>
        </div>

        {/* Stepper Card */}
        <div className="bg-white rounded-2xl border border-border-card p-6 shadow-sm overflow-hidden pb-10">
          <ReservationStepper currentStatus={reservation.status} />
          
          {/* Alerte Annulation */}
          {reservation.status === 'Annulée' && (
            <div className="mt-8 flex items-center gap-2 text-[13px] font-medium text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
              <Info size={16} className="text-red-500 flex-shrink-0" />
              <span><strong>Réservation annulée</strong> - {reservation.alert || "Client ne s'est pas présenté"}</span>
            </div>
          )}
        </div>

        {/* Info Client */}
        <div className="bg-white rounded-2xl border border-border-card p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-[16px]">
            {getInitials(reservation.customer.firstName, reservation.customer.lastName)}
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-text-foreground">
              {reservation.customer.firstName} {reservation.customer.lastName}
            </span>
            <span className="text-[13px] font-medium text-text-muted">
              {reservation.customer.phone}
            </span>
          </div>
        </div>

        {/* Médicaments Réservés */}
        <div className="bg-white rounded-2xl border border-border-card shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-border-card">
            <h3 className="text-[10px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Médicaments réservés</h3>
          </div>
          <div className="flex flex-col">
            {reservation.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-5 border-b border-border-divider last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center">
                    <Pill size={14} className="text-brand-primary" />
                  </div>
                  <span className="text-[14px] font-bold text-text-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[12px] font-bold text-text-muted opacity-60">x{item.quantity}</span>
                  <span className="text-[14px] font-bold text-text-foreground min-w-[80px] text-right">{formatFCFA(item.price)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 bg-surface-alt border-t border-border-card flex items-center justify-between">
            <span className="text-[14px] font-bold text-text-foreground">Total</span>
            <span className="text-[18px] font-bold text-brand-primary">{formatFCFA(reservation.totalAmount)}</span>
          </div>
        </div>

        {/* Note Client */}
        {reservation.note && (
          <div className="bg-[#FFF8F0] border border-[#FFE8D6] rounded-2xl p-5">
            <h3 className="text-[10px] font-bold text-[#D97706] uppercase tracking-[0.08em] mb-1.5">Note Client</h3>
            <p className="text-[14px] font-medium text-[#B45309]">{reservation.note}</p>
          </div>
        )}

        {/* Actions Dynamiques */}
        {renderActions()}

      </div>
    </div>
  );
}
