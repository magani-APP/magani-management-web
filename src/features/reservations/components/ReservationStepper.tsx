import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReservationStatus } from '@/types/reservations.types';

interface ReservationStepperProps {
  currentStatus: ReservationStatus;
}

const STEPS: ReservationStatus[] = ['Nouvelle', 'Confirmée', 'Préparée', 'Retirée'];

export function ReservationStepper({ currentStatus }: ReservationStepperProps) {
  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="w-full flex items-center justify-between px-1">
      {STEPS.map((step, index) => {
        const isPassedOrCurrent = index <= currentIndex;
        const isLineActive = index < currentIndex;

        return (
          <div key={step} className="flex-1 flex items-center last:flex-none">
            {/* Élément Étape (Cercle + Libellé) */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                  isPassedOrCurrent
                    ? "bg-[#0D7A5F] text-white"
                    : "bg-gray-50 text-gray-300 border border-gray-200"
                )}
              >
                {isPassedOrCurrent ? (
                  <Check size={12} strokeWidth={3} />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                )}
              </div>

              <span
                className={cn(
                  "text-[10px] font-bold mt-1.5 whitespace-nowrap",
                  isPassedOrCurrent ? "text-[#0D7A5F]" : "text-gray-400"
                )}
              >
                {step}
              </span>
            </div>

            {/* Ligne de liaison */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-[2px] flex-1 mx-2 -mt-4 transition-colors duration-300",
                  isLineActive ? "bg-[#0D7A5F]" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}