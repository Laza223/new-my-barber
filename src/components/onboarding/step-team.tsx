/**
 * Paso 3: Equipo — solo o con profesionales.
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Plus,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import * as React from 'react';

export interface ProfessionalItem {
  name: string;
  commissionRate: number;
}

export interface TeamData {
  mode: 'solo' | 'team' | null;
  professionals: ProfessionalItem[];
  ownerCommission: number;
}

interface StepTeamProps {
  data: TeamData;
  onNext: (data: TeamData) => void;
  onBack: () => void;
}

export function StepTeam({ data, onNext, onBack }: StepTeamProps) {
  const [mode, setMode] = React.useState<'solo' | 'team' | null>(data.mode);
  const [professionals, setProfessionals] = React.useState<ProfessionalItem[]>(
    data.professionals.length > 0
      ? data.professionals
      : [{ name: '', commissionRate: 45 }],
  );
  const [ownerCommission, setOwnerCommission] = React.useState(
    data.ownerCommission,
  );
  const [error, setError] = React.useState('');

  function addProfessional() {
    setProfessionals((prev) => [...prev, { name: '', commissionRate: 45 }]);
  }

  function removeProfessional(index: number) {
    setProfessionals((prev) => prev.filter((_, i) => i !== index));
  }

  function updatePro(
    index: number,
    field: keyof ProfessionalItem,
    value: string | number,
  ) {
    setProfessionals((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  }

  function handleNext() {
    if (!mode) return;

    if (mode === 'team') {
      const invalid = professionals.find(
        (p) => !p.name.trim() || p.commissionRate < 0 || p.commissionRate > 100,
      );
      if (invalid) {
        setError('Completá nombre y comisión (0-100%) de cada profesional');
        return;
      }
    }

    setError('');
    onNext({
      mode,
      professionals: mode === 'team' ? professionals : [],
      ownerCommission,
    });
  }

  const SAMPLE_AMOUNT = 10000_00; // $10.000 en centavos

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-xl font-bold">
          ¿Trabajás solo o con equipo?
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Podés cambiar esto después.
        </p>
      </div>

      {/* Mode selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMode('solo')}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all',
            mode === 'solo'
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-border hover:border-primary/40',
          )}
        >
          <User className="h-8 w-8" />
          <span className="text-sm font-semibold">Trabajo solo</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('team')}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all',
            mode === 'team'
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-border hover:border-primary/40',
          )}
        >
          <Users className="h-8 w-8" />
          <span className="text-sm font-semibold">Tengo equipo</span>
        </button>
      </div>

      {/* Solo mode */}
      {mode === 'solo' && (
        <div className="bg-card space-y-3 rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">
            Perfecto, tu cuenta se configura como profesional único con 100% de
            comisión.
          </p>
        </div>
      )}

      {/* Team mode */}
      {mode === 'team' && (
        <div className="space-y-4">
          {/* Commission tooltip */}
          <div className="bg-primary/5 border-primary/20 flex items-start gap-2 rounded-lg border p-3">
            <Info className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-muted-foreground text-xs">
              La comisión es el % que se lleva el profesional. Ej: si cobra
              $10.000 y la comisión es 45%, se lleva $4.500 y vos $5.500.
            </p>
          </div>

          {/* Professionals list */}
          <div className="space-y-3">
            {professionals.map((pro, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Nombre del profesional"
                    value={pro.name}
                    onChange={(e) => updatePro(index, 'name', e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="w-20">
                  <Input
                    placeholder="%"
                    value={String(pro.commissionRate)}
                    onChange={(e) =>
                      updatePro(
                        index,
                        'commissionRate',
                        Math.min(
                          100,
                          Math.max(
                            0,
                            Number(e.target.value.replace(/\D/g, '')),
                          ),
                        ),
                      )
                    }
                    inputMode="numeric"
                    className="h-9 text-center text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeProfessional(index)}
                  className="text-muted-foreground hover:text-destructive p-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                {/* Preview */}
                {pro.commissionRate > 0 && (
                  <span className="text-muted-foreground hidden w-20 self-center text-xs sm:block">
                    {formatCurrency(
                      Math.round((SAMPLE_AMOUNT * pro.commissionRate) / 100),
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addProfessional}
            className="w-full"
          >
            <Plus className="h-4 w-4" />
            Agregar profesional
          </Button>

          {/* Owner commission */}
          <div className="bg-card space-y-3 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">
              Vos como dueño también podés atender. Tu comisión:
            </p>
            <div className="flex items-center gap-2">
              <Input
                value={String(ownerCommission)}
                onChange={(e) =>
                  setOwnerCommission(
                    Math.min(
                      100,
                      Math.max(0, Number(e.target.value.replace(/\D/g, ''))),
                    ),
                  )
                }
                inputMode="numeric"
                className="h-9 w-20 text-center text-sm"
              />
              <span className="text-muted-foreground text-sm">%</span>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-destructive text-center text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </Button>
        <Button onClick={handleNext} className="flex-1" disabled={!mode}>
          Siguiente
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
