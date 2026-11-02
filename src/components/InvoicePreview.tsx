'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  MessageSquare, 
  Edit3, 
  CheckCircle2, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Invoice, CompanyProfile } from '@/types/invoice';
import { formatIDR, formatDateIndo } from '@/lib/format';

interface InvoicePreviewProps {
  invoice: Invoice;
  company: CompanyProfile;
  onClose: () => void;
  onEdit: (invoice: Invoice) => void;
  onOpenWhatsApp: (invoice: Invoice) => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  company,
  onClose,
  onEdit,
  onOpenWhatsApp,
}) => {
  // If status is 'dibayar', default show paid stamp is true
  const [showPaidStamp, setShowPaidStamp] = useState(invoice.status === 'dibayar');

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice.status === 'dibayar';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 flex justify-center animate-fadeIn preview-modal-overlay">
      
      <div className="w-full max-w-4xl space-y-3 my-auto preview-modal-inner">
        
        {/* Top Floating Action Bar (Hidden completely during Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/95 border border-zinc-800 px-4 py-2.5 rounded-2xl shadow-2xl print-action-bar print:hidden no-print" data-print-hidden="true">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              {invoice.invoiceNumber}
            </span>
            <span className="text-xs text-zinc-300 font-medium">
              {invoice.client.name} {invoice.client.company && `• ${invoice.client.company}`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Stamp LUNAS toggle (only relevant when invoice is paid) */}
            {isPaid && (
              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-800/80 border border-zinc-700 text-xs text-emerald-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPaidStamp}
                  onChange={(e) => setShowPaidStamp(e.target.checked)}
                  className="rounded border-zinc-600 text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Stempel LUNAS</span>
              </label>
            )}

            <button
              onClick={() => onOpenWhatsApp(invoice)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Kirim WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 text-xs font-bold px-4 py-1.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
              title="Cetak atau Simpan sebagai PDF (A4)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={() => onEdit(invoice)}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors"
              title="Edit Invoice"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors"
              title="Tutup Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Container (Exact Clean A4 Ratio) */}
        <div 
          id="printable-invoice"
          className="bg-white text-zinc-900 rounded-2xl shadow-2xl p-6 sm:p-9 relative overflow-hidden border border-zinc-200"
        >
          {/* Status Watermark Stamp: ONLY shown if invoice is paid and toggled on */}
          {isPaid && showPaidStamp && (
            <div className="absolute top-12 right-8 pointer-events-none opacity-25 rotate-[-12deg] select-none z-10">
              <div className="border-[3px] border-emerald-600 text-emerald-700 font-black text-2xl sm:text-4xl uppercase px-4 py-1.5 rounded-xl tracking-widest text-center shadow-sm">
                LUNAS / PAID
              </div>
              {invoice.paymentReceivedDate && (
                <div className="text-center font-mono text-[9px] text-emerald-800 font-bold mt-0.5 tracking-wider uppercase">
                  Diterima: {formatDateIndo(invoice.paymentReceivedDate)}
                </div>
              )}
            </div>
          )}

          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-200 pb-4">
            
            {/* Brand Logo & Company Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00] flex items-center justify-center text-zinc-950 font-black text-lg tracking-tighter shadow-sm font-mono">
                  PA
                </div>
                <div>
                  <h1 className="text-base font-black text-zinc-950 tracking-tight leading-none">{company.name}</h1>
                  <p className="text-[10px] text-orange-600 font-bold tracking-tight uppercase mt-0.5">{company.tagline}</p>
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 space-y-0.5 pt-1.5 leading-relaxed max-w-sm">
                <p>{company.address}</p>
                <p>Email: <span className="text-zinc-700 font-medium">{company.email}</span> • WA: <span className="text-zinc-700 font-medium">{company.phone}</span></p>
                {company.website && <p className="text-zinc-400">{company.website}</p>}
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="text-left sm:text-right space-y-0.5">
              <div className="text-xl font-black text-zinc-950 tracking-tight uppercase">
                INVOICE
              </div>
              <div className="font-mono text-xs font-bold text-orange-600">
                {invoice.invoiceNumber}
              </div>

              <div className="text-[10px] text-zinc-600 pt-1 space-y-0.5">
                <div>
                  <span className="text-zinc-400">Tanggal Terbit: </span>
                  <strong className="text-zinc-800">{formatDateIndo(invoice.issueDate)}</strong>
                </div>
                <div>
                  <span className="text-zinc-400">Jatuh Tempo: </span>
                  <strong className="text-zinc-800">{formatDateIndo(invoice.dueDate)}</strong>
                </div>
                <div className="pt-0.5">
                  <span className="text-zinc-400">Status Tagihan: </span>
                  {isPaid ? (
                    <span className="inline-block font-bold uppercase text-[9px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Lunas / Paid
                    </span>
                  ) : (
                    <span className="inline-block font-semibold uppercase text-[9px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                      Tagihan Terbuka
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Client Details Box (Bill To) */}
          <div className="my-3.5 p-3 rounded-xl bg-zinc-50/80 border border-zinc-200/90 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                Ditagihkan Kepada (Bill To):
              </div>
              <div className="text-xs font-bold text-zinc-950">
                {invoice.client.name}
              </div>
              {invoice.client.company && (
                <div className="text-[11px] font-semibold text-zinc-700 mt-0.5">{invoice.client.company}</div>
              )}
              {invoice.client.address && (
                <div className="text-[10px] text-zinc-500 mt-0.5">{invoice.client.address}</div>
              )}
            </div>

            <div className="sm:text-right space-y-0.5">
              <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                Kontak Klien:
              </div>
              {invoice.client.phone && (
                <div className="text-[11px] text-zinc-700">
                  WhatsApp: <strong className="text-zinc-900 font-mono">{invoice.client.phone}</strong>
                </div>
              )}
              {invoice.client.email && (
                <div className="text-[11px] text-zinc-600">
                  Email: <span className="font-medium text-zinc-800">{invoice.client.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900 text-zinc-950 font-bold text-[11px]">
                  <th className="py-2 px-1.5 w-8 text-center">No</th>
                  <th className="py-2 px-2.5">Layanan / Ruang Lingkup Deliverables</th>
                  <th className="py-2 px-1.5 w-14 text-center">Qty</th>
                  <th className="py-2 px-1.5 w-16 text-center">Satuan</th>
                  <th className="py-2 px-2.5 w-28 text-right">Harga Satuan</th>
                  <th className="py-2 px-2.5 w-28 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id} className="align-top">
                    <td className="py-2.5 px-1.5 text-center text-zinc-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-2.5 px-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-zinc-900 text-xs">{item.name}</span>
                        {item.category && (
                          <span className="text-[9px] text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded font-bold border border-orange-200 uppercase tracking-wider">
                            {item.category}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <div className="text-zinc-500 text-[10px] mt-0.5 leading-relaxed">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-1.5 text-center font-semibold text-zinc-800 text-xs">{item.quantity}</td>
                    <td className="py-2.5 px-1.5 text-center text-zinc-600 text-xs">{item.unit}</td>
                    <td className="py-2.5 px-2.5 text-right font-mono text-zinc-800 text-xs">{formatIDR(item.unitPrice)}</td>
                    <td className="py-2.5 px-2.5 text-right font-mono font-bold text-zinc-950 text-xs">{formatIDR(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation & Bank Details Section (Side by Side) */}
          <div className="mt-4 pt-3.5 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs prevent-break">
            
            {/* Left: Payment Transfer Info & Terms */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100/90 space-y-1">
                <div className="font-bold text-orange-950 uppercase tracking-wider text-[10px]">
                  Instruksi Pembayaran Transfer:
                </div>
                <div className="text-zinc-700 space-y-0.5 text-[11px]">
                  <div>
                    Bank: <strong>{company.bankName}</strong>
                  </div>
                  <div>
                    No. Rekening: <strong className="font-mono text-xs text-zinc-950">{company.accountNumber}</strong>
                  </div>
                  <div>
                    Atas Nama: <strong className="text-zinc-900">{company.accountHolder}</strong>
                  </div>
                </div>

                {company.secondaryBankName && (
                  <div className="text-zinc-600 pt-1 text-[10px] border-t border-orange-200/50">
                    Alternatif: {company.secondaryBankName} - {company.secondaryAccountNumber} (a/n {company.secondaryAccountHolder})
                  </div>
                )}
              </div>

              {invoice.paymentTerms && (
                <div>
                  <div className="font-bold text-zinc-800 text-[10px] uppercase mb-0.5">Ketentuan Pembayaran:</div>
                  <p className="text-zinc-600 text-[10px] leading-relaxed">{invoice.paymentTerms}</p>
                </div>
              )}

              {invoice.notes && (
                <div>
                  <div className="font-bold text-zinc-800 text-[10px] uppercase mb-0.5">Catatan:</div>
                  <p className="text-zinc-500 italic text-[10px] leading-relaxed">"{invoice.notes}"</p>
                </div>
              )}
            </div>

            {/* Right: Subtotal, Discount, Tax, Grand Total + Signature */}
            <div className="space-y-3">
              <div className="bg-zinc-50/80 rounded-xl p-3 border border-zinc-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-zinc-600 text-[11px]">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-zinc-800">{formatIDR(invoice.subtotal)}</span>
                </div>

                {invoice.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-rose-600 text-[11px]">
                    <span>
                      Diskon {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}:
                    </span>
                    <span className="font-mono font-semibold">-{formatIDR(invoice.discountAmount)}</span>
                  </div>
                )}

                {invoice.taxRate > 0 && (
                  <div className="flex items-center justify-between text-zinc-600 text-[11px]">
                    <span>PPN ({invoice.taxRate}%):</span>
                    <span className="font-mono font-semibold text-zinc-800">+{formatIDR(invoice.taxAmount)}</span>
                  </div>
                )}

                <div className="border-t-2 border-zinc-900 pt-1.5 flex items-center justify-between">
                  <span className="font-black text-xs text-zinc-950 uppercase tracking-tight">Grand Total:</span>
                  <span className="text-base font-black text-orange-600 font-mono">
                    {formatIDR(invoice.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Signature Block */}
              <div className="pt-2 flex justify-end">
                <div className="text-center w-44">
                  <div className="text-[10px] text-zinc-500">Hormat Kami,</div>
                  <div className="font-bold text-zinc-900 text-[11px] mt-0.5">{company.name}</div>
                  
                  {/* Digital Stamp Simulation: PROJECT-A */}
                  <div className="my-1 h-12 flex items-center justify-center relative">
                    <div className="w-14 h-14 rounded-full border-2 border-orange-500/50 border-dashed flex items-center justify-center text-[7px] font-black uppercase text-orange-600 rotate-[-10deg] select-none text-center leading-tight">
                      PROJECT-A<br />OFFICIAL
                    </div>
                  </div>

                  <div className="border-b border-zinc-900 pb-0.5 font-bold text-[11px] text-zinc-950">
                    {company.accountHolder || 'REINALDI CHAIRAHMANDIKA'}
                  </div>
                  <div className="text-[9px] text-zinc-500">Managing Director</div>
                </div>
              </div>

            </div>

          </div>

          {/* Footer note */}
          <div className="mt-5 pt-2.5 border-t border-zinc-200 text-center text-[9px] text-zinc-400">
            Invoice ini diterbitkan secara resmi oleh {company.name} ({company.tagline}) dan sah tanpa tanda tangan basah fisik. Terima kasih atas kerjasamanya.
          </div>

        </div>

      </div>

    </div>
  );
};
