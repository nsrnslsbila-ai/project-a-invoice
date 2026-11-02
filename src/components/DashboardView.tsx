'use client';

import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  ArrowUpRight, 
  MessageSquare, 
  Printer, 
  ChevronRight,
  Sparkles,
  PieChart,
  Calendar,
  Layers
} from 'lucide-react';
import { Invoice, InvoiceStatus, CompanyProfile } from '@/types/invoice';
import { formatIDR, formatDateIndo } from '@/lib/format';

interface DashboardViewProps {
  invoices: Invoice[];
  company: CompanyProfile;
  onCreateNew: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onUpdateStatus: (invoiceId: string, newStatus: InvoiceStatus) => void;
  onOpenWhatsApp: (invoice: Invoice) => void;
  onGoToInvoices: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  invoices,
  company,
  onCreateNew,
  onViewInvoice,
  onUpdateStatus,
  onOpenWhatsApp,
  onGoToInvoices,
}) => {
  // Financial metrics calculations
  const totalInvoicesCount = invoices.length;

  const totalOmzet = invoices.reduce((sum, inv) => {
    if (inv.status === 'dibatalkan') return sum;
    return sum + (inv.grandTotal || 0);
  }, 0);

  const omzetDibayar = invoices
    .filter(inv => inv.status === 'dibayar')
    .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

  const omzetMenunggak = invoices
    .filter(inv => inv.status === 'menunggak')
    .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

  const omzetFollowUp = invoices
    .filter(inv => inv.status === 'follow_up')
    .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

  const paidCount = invoices.filter(inv => inv.status === 'dibayar').length;
  const menunggakCount = invoices.filter(inv => inv.status === 'menunggak').length;
  const followUpCount = invoices.filter(inv => inv.status === 'follow_up').length;
  const draftCount = invoices.filter(inv => inv.status === 'draft').length;

  const paidPercentage = totalOmzet > 0 ? Math.round((omzetDibayar / totalOmzet) * 100) : 0;

  // Category breakdown
  const categoryStats: Record<string, { count: number; total: number }> = {};
  invoices.forEach(inv => {
    if (inv.status === 'dibatalkan') return;
    inv.items.forEach(item => {
      const cat = item.category || 'Integrated Solutions';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { count: 0, total: 0 };
      }
      categoryStats[cat].count += item.quantity || 1;
      categoryStats[cat].total += item.total || 0;
    });
  });

  const categoryList = Object.entries(categoryStats)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  // Invoices requiring attention (menunggak & follow_up)
  const pendingInvoices = invoices
    .filter(inv => inv.status === 'menunggak' || inv.status === 'follow_up')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner: PROJECT-A Identity */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-[#1C1C1C] to-zinc-950 border border-orange-500/25 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>PROJECT-A • One-Stop Creative Solution</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ringkasan Omzet & Tagihan PROJECT-A
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-xl leading-relaxed">
              Pantau cashflow terintegrasi (Manage, Create, Grow), tagihan klien aktif, dan otomatisasi pengingat pembayaran WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold text-sm px-5 py-3 rounded-2xl shadow-xl shadow-orange-500/20 transition-all hover:scale-[1.02]"
            >
              <TrendingUp className="w-4 h-4" />
              <span>+ Buat Invoice Baru</span>
            </button>
            <button
              onClick={onGoToInvoices}
              className="flex items-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 text-sm font-semibold px-4 py-3 rounded-2xl transition-all"
            >
              <span>Riwayat Invoice</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Omzet */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Nilai Tagihan</span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-white tracking-tight font-mono">
              {formatIDR(totalOmzet)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
              <span className="text-orange-400 font-bold">{totalInvoicesCount} invoice</span>
              <span>• Semua transaksi aktif</span>
            </div>
          </div>
        </div>

        {/* Omzet Dibayar (Lunas) */}
        <div className="bg-zinc-900/60 border border-emerald-900/30 hover:border-emerald-800/50 rounded-2xl p-5 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Sudah Dibayar (Lunas)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-400 tracking-tight font-mono">
              {formatIDR(omzetDibayar)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
              <span className="text-emerald-400 font-bold">{paidPercentage}% realisasi</span>
              <span>• {paidCount} invoice lunas</span>
            </div>
          </div>
        </div>

        {/* Menunggak (Pending Payment) */}
        <div className="bg-zinc-900/60 border border-rose-900/30 hover:border-rose-800/50 rounded-2xl p-5 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Menunggak (Belum Bayar)</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-rose-400 tracking-tight font-mono">
              {formatIDR(omzetMenunggak)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
              <span className="text-rose-400 font-bold">{menunggakCount} invoice</span>
              <span>• Menunggu pelunasan</span>
            </div>
          </div>
        </div>

        {/* Sedang di Follow-up */}
        <div className="bg-zinc-900/60 border border-amber-900/30 hover:border-amber-800/50 rounded-2xl p-5 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Sudah di-Follow Up</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-amber-400 tracking-tight font-mono">
              {formatIDR(omzetFollowUp)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
              <span className="text-amber-400 font-bold">{followUpCount} invoice</span>
              <span>• Sudah diingatkan via WA</span>
            </div>
          </div>
        </div>

      </div>

      {/* Progress & Cashflow Realization Bar */}
      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-200">Realisasi Penerimaan Dana Invoice</h3>
            <p className="text-xs text-zinc-400">Rasio perbandingan omzet yang telah masuk ke rekening vs piutang berjalan</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-zinc-300">Lunas ({paidPercentage}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="text-zinc-300">Follow Up</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="text-zinc-300">Menunggak</span>
            </div>
          </div>
        </div>

        {/* Multi-segment progress bar */}
        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${totalOmzet > 0 ? (omzetDibayar / totalOmzet) * 100 : 0}%` }} 
            className="bg-emerald-500 transition-all duration-500" 
            title={`Dibayar: ${formatIDR(omzetDibayar)}`}
          />
          <div 
            style={{ width: `${totalOmzet > 0 ? (omzetFollowUp / totalOmzet) * 100 : 0}%` }} 
            className="bg-amber-500 transition-all duration-500" 
            title={`Follow Up: ${formatIDR(omzetFollowUp)}`}
          />
          <div 
            style={{ width: `${totalOmzet > 0 ? (omzetMenunggak / totalOmzet) * 100 : 0}%` }} 
            className="bg-rose-500 transition-all duration-500" 
            title={`Menunggak: ${formatIDR(omzetMenunggak)}`}
          />
        </div>
      </div>

      {/* Grid: Invoices Requiring Follow-up + Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Invoices needing attention */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
              <h2 className="text-base font-bold text-white">
                Invoice Perlu Follow Up Segera ({pendingInvoices.length})
              </h2>
            </div>
            <span className="text-xs text-zinc-400">Urut berdasarkan jatuh tempo</span>
          </div>

          {pendingInvoices.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-70" />
              <p className="text-sm text-zinc-300 font-medium">Luar biasa! Tidak ada tagihan yang menunggak.</p>
              <p className="text-xs text-zinc-500 mt-1">Semua invoice klien PROJECT-A sudah lunas atau masih berstatus draft.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingInvoices.slice(0, 5).map(inv => {
                const isOverdue = new Date(inv.dueDate) < new Date();
                return (
                  <div 
                    key={inv.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">{inv.invoiceNumber}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          inv.status === 'menunggak'
                            ? isOverdue ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                        }`}>
                          {inv.status === 'menunggak' ? (isOverdue ? 'Jatuh Tempo (Overdue)' : 'Menunggak') : 'Sudah Follow Up'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-200 mt-1.5">
                        {inv.client.name} {inv.client.company && <span className="text-zinc-400 font-normal">({inv.client.company})</span>}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Jatuh Tempo: <span className={isOverdue ? 'text-red-400 font-medium' : 'text-zinc-300'}>{formatDateIndo(inv.dueDate)}</span>
                        {inv.lastFollowUpDate && ` • Follow up terakhir: ${formatDateIndo(inv.lastFollowUpDate)}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800">
                      <div className="text-left sm:text-right">
                        <div className="text-sm font-extrabold text-white font-mono">{formatIDR(inv.grandTotal)}</div>
                        <div className="text-[11px] text-zinc-400">{inv.items.length} item deliverables</div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenWhatsApp(inv)}
                          title="Kirim Pesan WhatsApp Follow-up"
                          className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-1.5 rounded-lg transition-colors font-semibold"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WA Follow Up</span>
                        </button>

                        <button
                          onClick={() => onUpdateStatus(inv.id, 'dibayar')}
                          title="Tandai Sudah Dibayar (Lunas)"
                          className="p-1.5 bg-zinc-800 hover:bg-emerald-600/30 border border-zinc-700 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400 rounded-lg transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onViewInvoice(inv)}
                          title="Lihat Detail & Cetak PDF"
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Top Solutions Breakdown */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Layanan Kreatif Teratas</h2>
            <Layers className="w-4 h-4 text-orange-400" />
          </div>

          {categoryList.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">Belum ada invoice yang dibuat.</p>
          ) : (
            <div className="space-y-4">
              {categoryList.map(([category, stats], idx) => {
                const percent = totalOmzet > 0 ? Math.round((stats.total / totalOmzet) * 100) : 0;
                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200 truncate max-w-[170px]" title={category}>
                        {category}
                      </span>
                      <span className="font-bold text-zinc-300 font-mono">{formatIDR(stats.total)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${percent}%` }}
                          className={`h-full rounded-full ${
                            idx === 0 ? 'bg-orange-500' :
                            idx === 1 ? 'bg-amber-500' :
                            idx === 2 ? 'bg-emerald-500' :
                            idx === 3 ? 'bg-sky-500' : 'bg-purple-500'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400 w-8 text-right font-mono">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-zinc-800/60 text-xs text-zinc-400 space-y-2">
            <div className="flex items-center justify-between">
              <span>Invoice Lunas:</span>
              <span className="text-emerald-400 font-bold">{paidCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Invoice Menunggak:</span>
              <span className="text-rose-400 font-bold">{menunggakCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Sedang Follow Up:</span>
              <span className="text-amber-400 font-bold">{followUpCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Draft Konsep:</span>
              <span className="text-zinc-400 font-bold">{draftCount}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
