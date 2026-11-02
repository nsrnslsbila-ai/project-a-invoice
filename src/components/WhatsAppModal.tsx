'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Copy, 
  Check, 
  Send, 
  Clock, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { Invoice, CompanyProfile } from '@/types/invoice';
import { 
  formatIDR, 
  formatDateIndo, 
  formatWhatsAppNumber, 
  generateWhatsAppFollowUpLink 
} from '@/lib/format';

interface WhatsAppModalProps {
  invoice: Invoice;
  company: CompanyProfile;
  onClose: () => void;
  onMarkFollowedUp: (invoiceId: string) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  invoice,
  company,
  onClose,
  onMarkFollowedUp,
}) => {
  const [templateType, setTemplateType] = useState<'reminder' | 'overdue' | 'paid'>('reminder');
  const [copied, setCopied] = useState(false);

  const cleanPhone = formatWhatsAppNumber(invoice.client.phone);
  const clientName = invoice.client.name || 'Klien';
  const companyName = invoice.client.company ? ` (${invoice.client.company})` : '';
  const total = formatIDR(invoice.grandTotal);
  const dueDate = formatDateIndo(invoice.dueDate);
  const itemsSummary = invoice.items.map(i => `• ${i.name} (${i.quantity} ${i.unit})`).join('\n');

  // Build message based on template
  const getMessageText = () => {
    if (templateType === 'reminder') {
      return `Halo Kak ${clientName}${companyName}, selamat siang/sore! 👋\n\n` +
        `Semoga kabarnya selalu sehat dan lancar ya. Kami dari tim *${company.name}* ingin mengonfirmasikan dan memberikan pengingat terkait invoice project kreatif yang sedang berjalan:\n\n` +
        `📄 *No. Invoice:* ${invoice.invoiceNumber}\n` +
        `💼 *Layanan:* \n${itemsSummary}\n` +
        `💰 *Total Tagihan:* *${total}*\n` +
        `📅 *Jatuh Tempo:* ${dueDate}\n\n` +
        `Pembayaran dapat ditransfer ke rekening resmi kami:\n` +
        `🏦 *${company.bankName}*\n` +
        `💳 No. Rek: *${company.accountNumber}*\n` +
        `👤 A/N: *${company.accountHolder}*\n\n` +
        `Jika pembayaran sudah diproses, mohon kirimkan bukti transfernya ke kami ya Kak. Terima kasih banyak atas kerjasamanya! 🙏✨\n\n` +
        `Salam hangat,\n*${company.name}*`;
    } else if (templateType === 'overdue') {
      return `Halo Kak ${clientName}${companyName}, semoga dalam keadaan sehat! 🙏\n\n` +
        `Kami dari manajemen finance *${company.name}* ingin menindaklanjuti perihal invoice berikut yang telah melewati tanggal jatuh tempo:\n\n` +
        `📄 *No. Invoice:* ${invoice.invoiceNumber}\n` +
        `💰 *Total Menunggak:* *${total}*\n` +
        `⚠️ *Jatuh Tempo:* ${dueDate}\n\n` +
        `Mohon informasinya apakah proses pembayaran sudah dapat dijadwalkan hari ini? Detail rekening pembayaran:\n` +
        `🏦 *${company.bankName}*: ${company.accountNumber} (a/n ${company.accountHolder})\n\n` +
        `Apabila sudah melakukan pembayaran, mohon abaikan pesan ini dan berkenan mengirimkan buktinya ya Kak. Terima kasih atas pengertian dan kerjasamanya! 🙏`;
    } else {
      return `Halo Kak ${clientName}${companyName}! 🎉\n\n` +
        `Kami mengonfirmasi bahwa pembayaran untuk Invoice *${invoice.invoiceNumber}* sebesar *${total}* telah kami terima dengan lunas.\n\n` +
        `Terima kasih banyak atas kepercayaan Kakak dan tim kepada *${company.name}*. Sukses selalu untuk project dan bisnisnya! 🚀✨`;
    }
  };

  const messageText = getMessageText();

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank');

    // If it was reminder or overdue, auto mark as followed up
    if (templateType !== 'paid') {
      onMarkFollowedUp(invoice.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Follow Up WhatsApp Klien</h3>
              <p className="text-xs text-zinc-400">Penerima: {invoice.client.name} ({invoice.client.phone})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Selector */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/60 text-xs">
          <div className="text-[11px] font-semibold text-zinc-400 mb-2">Pilih Template Pesan:</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTemplateType('reminder')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                templateType === 'reminder'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5 mx-auto mb-1" />
              <span>Reminder Sopan</span>
            </button>

            <button
              onClick={() => setTemplateType('overdue')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                templateType === 'overdue'
                  ? 'bg-rose-500/10 border-rose-500 text-rose-300 font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 mx-auto mb-1" />
              <span>Tagihan Overdue</span>
            </button>

            <button
              onClick={() => setTemplateType('paid')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                templateType === 'paid'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-1" />
              <span>Konfirmasi Lunas</span>
            </button>
          </div>
        </div>

        {/* Message Preview Box */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Preview Pesan WhatsApp:</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-violet-400 hover:text-violet-300"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
            {messageText}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between gap-3 bg-zinc-950">
          <button
            onClick={() => {
              onMarkFollowedUp(invoice.id);
              onClose();
            }}
            className="text-xs text-zinc-400 hover:text-zinc-200 underline"
          >
            Tandai Sudah Follow Up Saja
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Kirim via WhatsApp Web/App</span>
          </button>
        </div>

      </div>
    </div>
  );
};
