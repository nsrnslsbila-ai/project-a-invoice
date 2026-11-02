'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Printer, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ChevronDown,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { Invoice, InvoiceStatus, CompanyProfile } from '@/types/invoice';
import { formatIDR, formatDateIndo } from '@/lib/format';

interface InvoiceListProps {
  invoices: Invoice[];
  company: CompanyProfile;
  onCreateNew: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onUpdateStatus: (invoiceId: string, newStatus: InvoiceStatus) => void;
  onOpenWhatsApp: (invoice: Invoice) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  company,
  onCreateNew,
  onViewInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onUpdateStatus,
  onOpenWhatsApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Filtered and searched invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      // Status filter
      if (statusFilter !== 'all' && inv.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchNumber = inv.invoiceNumber.toLowerCase().includes(query);
        const matchClient = inv.client.name.toLowerCase().includes(query);
        const matchCompany = (inv.client.company || '').toLowerCase().includes(query);
        const matchItems = inv.items.some(item => 
          item.name.toLowerCase().includes(query) || 
          item.category.toLowerCase().includes(query)
        );
        return matchNumber || matchClient || matchCompany || matchItems;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [invoices, statusFilter, searchTerm]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: invoices.length,
      menunggak: invoices.filter(i => i.status === 'menunggak').length,
      follow_up: invoices.filter(i => i.status === 'follow_up').length,
      dibayar: invoices.filter(i => i.status === 'dibayar').length,
      draft: invoices.filter(i => i.status === 'draft').length,
    };
  }, [invoices]);

  const filteredTotalAmount = filteredInvoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);

  const getStatusBadge = (status: InvoiceStatus, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status !== 'dibayar';

    switch (status) {
      case 'dibayar':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Dibayar (Lunas)
          </span>
        );
      case 'follow_up':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Sudah di-Follow Up
          </span>
        );
      case 'menunggak':
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isOverdue 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
          }`}>
            <AlertCircle className="w-3.5 h-3.5" />
            {isOverdue ? 'Jatuh Tempo (Overdue)' : 'Menunggak'}
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-700/40 text-zinc-300 border border-zinc-600/30">
            <FileText className="w-3.5 h-3.5" />
            Draft
          </span>
        );
      case 'dibatalkan':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-500 border border-zinc-700">
            Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header & Search / Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Riwayat & Daftar Invoice</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Kelola status pembayaran, kirim pengingat tagihan ke klien, dan cetak invoice resmi.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Buat Invoice Baru</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-4">
        
        {/* Filter Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'all'
                ? 'bg-zinc-100 text-zinc-950 font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <span>Semua</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('menunggak')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'menunggak'
                ? 'bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20'
                : 'text-rose-400 hover:bg-rose-500/10'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Menunggak</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-300">
              {counts.menunggak}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('follow_up')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'follow_up'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
                : 'text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Sudah Follow Up</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300">
              {counts.follow_up}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('dibayar')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'dibayar'
                ? 'bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20'
                : 'text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Dibayar (Lunas)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300">
              {counts.dibayar}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'draft'
                ? 'bg-zinc-700 text-white font-bold'
                : 'text-zinc-400 hover:bg-zinc-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Draft</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400">
              {counts.draft}
            </span>
          </button>
        </div>

        {/* Search Bar & Total Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari no invoice, klien, nama brand, atau jenis jasa..."
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="text-xs text-zinc-400 flex items-center gap-2 self-end sm:self-auto">
            <span>Ditemukan: <strong className="text-zinc-200">{filteredInvoices.length}</strong> invoice</span>
            <span>• Total Nilai: <strong className="text-orange-400 font-mono">{formatIDR(filteredTotalAmount)}</strong></span>
          </div>
        </div>

      </div>

      {/* Invoices List / Cards */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-6">
          <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-zinc-300">Tidak ada invoice yang ditemukan</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {searchTerm 
              ? `Tidak ditemukan invoice dengan kata kunci "${searchTerm}". Silakan coba kata kunci lain.`
              : 'Belum ada invoice dalam kategori ini. Silakan buat invoice baru untuk memulai.'}
          </p>
          <button
            onClick={onCreateNew}
            className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 text-xs font-bold px-4 py-2 rounded-xl transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Invoice Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((inv) => {
            const isDropdownOpen = activeDropdownId === inv.id;

            return (
              <div
                key={inv.id}
                className="bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-4 sm:p-5 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Invoice Number, Client, Date & Items */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-md border border-orange-500/20">
                      {inv.invoiceNumber}
                    </span>
                    
                    {/* Status Badge */}
                    {getStatusBadge(inv.status, inv.dueDate)}

                    {/* Due Date Indicator */}
                    <span className="text-xs text-zinc-400">
                      Jatuh Tempo: <span className="text-zinc-300 font-medium">{formatDateIndo(inv.dueDate)}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {inv.client.name}
                      {inv.client.company && (
                        <span className="text-zinc-400 text-sm font-normal ml-2">
                          • {inv.client.company}
                        </span>
                      )}
                    </h3>
                    
                    {/* Items chips */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {inv.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 px-2 py-0.5 rounded-md"
                        >
                          {item.name} ({item.quantity} {item.unit})
                        </span>
                      ))}
                    </div>
                  </div>

                  {inv.notes && (
                    <p className="text-xs text-zinc-500 line-clamp-1 italic">
                      "{inv.notes}"
                    </p>
                  )}
                </div>

                {/* Right: Amount, Status Dropdown & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-zinc-800">
                  
                  {/* Grand Total */}
                  <div className="text-left md:text-right">
                    <div className="text-xs text-zinc-400">Total Tagihan</div>
                    <div className="text-lg font-extrabold text-white tracking-tight">
                      {formatIDR(inv.grandTotal)}
                    </div>
                  </div>

                  {/* Actions & Status Modifier */}
                  <div className="flex items-center gap-2 relative">
                    
                    {/* Status Changer Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdownId(isDropdownOpen ? null : inv.id)}
                        className="flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs px-2.5 py-1.5 rounded-xl border border-zinc-700 transition-colors"
                      >
                        <span>Ubah Status</span>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                      </button>

                      {isDropdownOpen && (
                        <div 
                          className="absolute right-0 mt-1 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1 animate-in fade-in"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="px-2 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                            Pilih Status Baru:
                          </div>

                          <button
                            onClick={() => {
                              onUpdateStatus(inv.id, 'dibayar');
                              setActiveDropdownId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 text-left font-medium"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Dibayar (Lunas)</span>
                          </button>

                          <button
                            onClick={() => {
                              onUpdateStatus(inv.id, 'follow_up');
                              setActiveDropdownId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 text-left font-medium"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Sudah di-Follow Up</span>
                          </button>

                          <button
                            onClick={() => {
                              onUpdateStatus(inv.id, 'menunggak');
                              setActiveDropdownId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-left font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Menunggak</span>
                          </button>

                          <button
                            onClick={() => {
                              onUpdateStatus(inv.id, 'draft');
                              setActiveDropdownId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800 text-left font-medium"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Draft</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Quick Link */}
                    <button
                      onClick={() => onOpenWhatsApp(inv)}
                      title="Kirim Pesan Tagihan / Follow-up via WhatsApp"
                      className="p-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 rounded-xl transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    {/* Preview / Print */}
                    <button
                      onClick={() => onViewInvoice(inv)}
                      title="Lihat Detail & Cetak PDF"
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 rounded-xl transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEditInvoice(inv)}
                      title="Edit Invoice"
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (confirm(`Hapus invoice ${inv.invoiceNumber} untuk klien ${inv.client.name}?`)) {
                          onDeleteInvoice(inv.id);
                        }
                      }}
                      title="Hapus Invoice"
                      className="p-2 bg-zinc-800 hover:bg-rose-900/30 text-zinc-400 hover:text-rose-400 border border-zinc-700/60 hover:border-rose-800/40 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
