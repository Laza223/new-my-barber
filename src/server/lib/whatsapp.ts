/**
 * WhatsApp summary builder — construye texto para enviar resúmenes por WhatsApp.
 */
import { formatCurrency } from '@/lib/utils';

interface DailySummaryData {
  shopName: string;
  date: string;
  revenue: number;
  salesCount: number;
  averageTicket: number;
  topService: { name: string; count: number } | null;
  topProfessional: { name: string; revenue: number } | null;
}

export function buildDailySummaryWhatsApp(data: DailySummaryData): string {
  const lines: string[] = [
    `📊 *Resumen diario — ${data.shopName}*`,
    `📅 ${data.date}`,
    '',
    `💰 Facturado: *${formatCurrency(data.revenue)}*`,
    `🧾 Ventas: *${data.salesCount}*`,
    `🎯 Ticket promedio: *${formatCurrency(data.averageTicket)}*`,
  ];

  if (data.topService) {
    lines.push(
      '',
      `✂️ Servicio top: *${data.topService.name}* (${data.topService.count}x)`,
    );
  }

  if (data.topProfessional) {
    lines.push(
      `🏆 Mejor profesional: *${data.topProfessional.name}* (${formatCurrency(data.topProfessional.revenue)})`,
    );
  }

  lines.push('', '_Generado por My Barber_');

  return lines.join('\n');
}

interface WeeklySummaryData {
  shopName: string;
  dateRange: string;
  revenue: number;
  salesCount: number;
  comparedToLastWeek: number;
  bestDay: { date: string; revenue: number } | null;
}

export function buildWeeklySummaryWhatsApp(data: WeeklySummaryData): string {
  const lines: string[] = [
    `📊 *Resumen semanal — ${data.shopName}*`,
    `📅 ${data.dateRange}`,
    '',
    `💰 Facturado: *${formatCurrency(data.revenue)}*`,
    `🧾 Ventas: *${data.salesCount}*`,
  ];

  if (data.comparedToLastWeek !== 0) {
    const arrow = data.comparedToLastWeek > 0 ? '📈' : '📉';
    lines.push(
      `${arrow} ${data.comparedToLastWeek > 0 ? '+' : ''}${data.comparedToLastWeek}% vs semana anterior`,
    );
  }

  if (data.bestDay) {
    lines.push(
      '',
      `🏆 Mejor día: *${data.bestDay.date}* (${formatCurrency(data.bestDay.revenue)})`,
    );
  }

  lines.push('', '_Generado por My Barber_');

  return lines.join('\n');
}

/**
 * Build WhatsApp URL to send a summary.
 */
export function buildWhatsAppUrl(text: string, phone?: string): string {
  const encoded = encodeURIComponent(text);
  return phone
    ? `https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}
