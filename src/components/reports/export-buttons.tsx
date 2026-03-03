/**
 * ExportButtons — PDF, Excel, WhatsApp.
 */
'use client';

import { Button } from '@/components/ui/button';
import type { ProfessionalLiquidation } from '@/lib/types/sale';
import { formatCurrency } from '@/lib/utils';
import { FileText, MessageCircle, Table2 } from 'lucide-react';
import * as React from 'react';

interface ExportButtonsProps {
  data: ProfessionalLiquidation;
  shopName: string;
}

export function ExportButtons({ data, shopName }: ExportButtonsProps) {
  const [exportingPdf, setExportingPdf] = React.useState(false);
  const [exportingXlsx, setExportingXlsx] = React.useState(false);

  async function handlePDF() {
    setExportingPdf(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(18);
      doc.text(shopName, 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Liquidación de profesional', 14, 28);

      // Professional info
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(data.professional.name, 14, 42);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Período: ${data.period.start} — ${data.period.end}`, 14, 50);
      doc.text(`Comisión: ${data.professional.commissionRate}%`, 14, 56);

      // Totals box
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(14, 64, pageWidth - 28, 30, 3, 3, 'F');
      doc.setFontSize(9);
      doc.setTextColor(100);
      const y = 74;
      const colW = (pageWidth - 28) / 4;
      doc.text('Facturado', 20, y);
      doc.text('Comisión', 20 + colW, y);
      doc.text('Propinas', 20 + colW * 2, y);
      doc.text('Total a pagar', 20 + colW * 3, y);
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(formatCurrency(data.totalRevenue), 20, y + 10);
      doc.text(formatCurrency(data.totalCommission), 20 + colW, y + 10);
      doc.text(formatCurrency(data.totalTips), 20 + colW * 2, y + 10);
      doc.text(formatCurrency(data.totalPayout), 20 + colW * 3, y + 10);

      // Table header
      let tableY = 104;
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text('Fecha', 14, tableY);
      doc.text('Hora', 44, tableY);
      doc.text('Servicio', 64, tableY);
      doc.text('Precio', 120, tableY, { align: 'right' });
      doc.text('Comisión', 150, tableY, { align: 'right' });
      doc.text('Propina', 180, tableY, { align: 'right' });
      doc.line(14, tableY + 2, pageWidth - 14, tableY + 2);

      // Table rows
      doc.setTextColor(0);
      tableY += 8;
      for (const sale of data.sales) {
        if (tableY > 270) {
          doc.addPage();
          tableY = 20;
        }
        doc.text(sale.saleDate, 14, tableY);
        doc.text(sale.saleTime.slice(0, 5), 44, tableY);
        doc.text(sale.serviceName.slice(0, 25), 64, tableY);
        doc.text(formatCurrency(sale.servicePrice), 120, tableY, {
          align: 'right',
        });
        doc.text(formatCurrency(sale.commissionAmount), 150, tableY, {
          align: 'right',
        });
        doc.text(
          sale.tipAmount > 0 ? formatCurrency(sale.tipAmount) : '—',
          180,
          tableY,
          { align: 'right' },
        );
        tableY += 6;
      }

      // Footer
      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.text('Generado por My Barber', 14, 290);

      // Download
      doc.save(
        `liquidacion-${data.professional.name.toLowerCase().replace(/\s+/g, '-')}-${data.period.start}.pdf`,
      );
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setExportingPdf(false);
    }
  }

  async function handleExcel() {
    setExportingXlsx(true);
    try {
      const XLSX = await import('xlsx');

      const rows = data.sales.map((sale) => ({
        Fecha: sale.saleDate,
        Hora: sale.saleTime.slice(0, 5),
        Servicio: sale.serviceName,
        Precio: sale.servicePrice / 100,
        Comisión: sale.commissionAmount / 100,
        Propina: sale.tipAmount / 100,
      }));

      // Add total row
      rows.push({
        Fecha: 'TOTAL',
        Hora: '',
        Servicio: `${data.sales.length} ventas`,
        Precio: data.totalRevenue / 100,
        Comisión: data.totalCommission / 100,
        Propina: data.totalTips / 100,
      });

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Liquidación');

      XLSX.writeFile(
        wb,
        `liquidacion-${data.professional.name.toLowerCase().replace(/\s+/g, '-')}-${data.period.start}.xlsx`,
      );
    } catch (err) {
      console.error('Excel export error:', err);
    } finally {
      setExportingXlsx(false);
    }
  }

  function handleWhatsApp() {
    const text =
      `*Liquidación de ${data.professional.name}*\n` +
      `Período: ${data.period.start} — ${data.period.end}\n\n` +
      `Facturado: ${formatCurrency(data.totalRevenue)}\n` +
      `Comisión (${data.professional.commissionRate}%): ${formatCurrency(data.totalCommission)}\n` +
      `Propinas: ${formatCurrency(data.totalTips)}\n` +
      `*Total a cobrar: ${formatCurrency(data.totalPayout)}*\n\n` +
      `_Generado por My Barber_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePDF}
        loading={exportingPdf}
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExcel}
        loading={exportingXlsx}
      >
        <Table2 className="h-4 w-4" />
        Excel
      </Button>
      <Button variant="outline" size="sm" onClick={handleWhatsApp}>
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </Button>
    </div>
  );
}
