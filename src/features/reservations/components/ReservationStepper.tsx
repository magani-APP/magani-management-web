import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReservationStatus } from '@/types/reservations.types';
import { RESERVATION_STEPS } from '@/constants/reservations.constants';

interface ReservationStepperProps {
  currentStatus: ReservationStatus;
}

export function ReservationStepper({ currentStatus }: ReservationStepperProps) {
  // If cancelled, we might want to just show it stopped at the step before it was cancelled,
  // but for simplicity, let's say Annulée clears the progress or stops it at Nouvelle.
  // Actually, usually a cancelled state either greys out everything or stops at the current.
  // We'll calculate the index.
  
  const currentStepIndex = currentStatus === 'Annulée' 
    ? 0 // Or wherever it was. For now, let's say 0.
    : RESERVATION_STEPS.indexOf(currentStatus);

  return (
    <div className="w-full flex items-center justify-between relative px-6 py-4">
      {/* Background Line */}
      <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-0.5 bg-border-card -z-10" />
      
      {/* Active Line */}
      {currentStatus !== 'Annulée' && currentStepIndex > 0 && (
        <div 
          className="absolute left-[10%] top-1/2 -translate-y-1/2 h-0.5 bg-brand-primary -z-10 transition-all duration-300" 
          style={{ width: `${(currentStepIndex / (RESERVATION_STEPS.length - 1)) * 80}%` }}
        />
      )}

      {RESERVATION_STEPS.map((step, index) => {
        const isCompleted = currentStatus !== 'Annulée' && index <= currentStepIndex;
        const isCurrent = currentStatus !== 'Annulée' && index === currentStepIndex;
        
        return (
          <div key={step} className="flex flex-col items-center gap-2 bg-white relative">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors border-2",
                isCompleted 
                  ? "bg-brand-primary border-brand-primary text-white" 
                  : "bg-surface-alt border-border-card text-text-hairline"
              )}
            >
              {isCompleted ? <Check size={16} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-border-card" />}
            </div>
            <span className={cn(
              "text-[10px] font-bold absolute top-10",
              isCurrent ? "text-brand-primary" : "text-text-placeholder"
            )}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
