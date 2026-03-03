/**
 * UpsellModal — aparece cuando una acción excede el plan.
 */
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowRight, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UpsellModalProps {
  open: boolean;
  onClose: () => void;
  feature: string;
  planRequired: string;
  currentPlan?: string;
}

export function UpsellModal({
  open,
  onClose,
  feature,
  planRequired,
  currentPlan = 'Free',
}: UpsellModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" />
            Función premium
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-muted-foreground text-sm">
            Necesitás el plan{' '}
            <strong className="text-foreground">{planRequired}</strong> para{' '}
            {feature}.
          </p>

          {/* Plan comparison */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border p-3 opacity-60">
              <p className="font-medium">{currentPlan}</p>
              <p className="text-muted-foreground text-xs">Tu plan actual</p>
            </div>
            <div className="border-primary/40 bg-primary/5 rounded-lg border p-3">
              <p className="text-primary font-medium">{planRequired}</p>
              <p className="text-muted-foreground text-xs">Recomendado</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Ahora no
            </Button>
            <Button
              onClick={() => {
                onClose();
                router.push('/settings');
              }}
              className="flex-1"
            >
              Actualizar plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
