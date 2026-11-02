import { Invoice, CompanyProfile } from '@/types/invoice';

/**
 * Format number to Indonesian Rupiah (IDR)
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date string (YYYY-MM-DD) to Indonesian formatted date
 */
export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Generate next invoice number based on current count and year
 * Prefix: PA (PROJECT-A)
 */
export function generateInvoiceNumber(existingCount: number = 0): string {
  const date = new Date();
  const year = date.getFullYear();
  const monthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][date.getMonth()];
  const sequence = String(existingCount + 1).padStart(3, '0');
  return `PA/${year}/${monthRoman}/${sequence}`;
}

/**
 * Clean phone number for WhatsApp (convert 08xx to 628xx)
 */
export function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62') && cleaned.length > 5) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

/**
 * Generate WhatsApp message URL for invoice follow up
 */
export function generateWhatsAppFollowUpLink(
  invoice: Invoice, 
  company: CompanyProfile,
  messageType: 'reminder' | 'overdue' | 'paid' = 'reminder'
): string {
  const cleanPhone = formatWhatsAppNumber(invoice.client.phone);
  const clientName = invoice.client.name || 'Klien';
  const companyName = invoice.client.company ? ` (${invoice.client.company})` : '';
  const total = formatIDR(invoice.grandTotal);
  const dueDate = formatDateIndo(invoice.dueDate);
  const itemsSummary = invoice.items.map(i => `• ${i.name} (${i.quantity} ${i.unit})`).join('\n');

  let text = '';

  if (messageType === 'reminder') {
    text = `Halo Kak ${clientName}${companyName}, selamat siang/sore! 👋\n\n` +
      `Semoga kabarnya selalu sehat dan produktif. Kami dari tim *${company.name}* ingin mengonfirmasi dan mengirimkan rincian invoice project yang sedang berjalan:\n\n` +
      `📄 *No. Invoice:* ${invoice.invoiceNumber}\n` +
      `💼 *Layanan:* \n${itemsSummary}\n` +
      `💰 *Total Tagihan:* *${total}*\n` +
      `📅 *Jatuh Tempo:* ${dueDate}\n\n` +
      `Pembayaran dapat ditransfer ke rekening resmi kami:\n` +
      `🏦 *${company.bankName}*\n` +
      `💳 No. Rek: *${company.accountNumber}*\n` +
      `👤 A/N: *${company.accountHolder}*\n\n` +
      `Jika pembayaran telah dilakukan, mohon kirimkan bukti transfer ke kami ya Kak. Terima kasih banyak atas kepercayaannya! 🙏✨\n\n` +
      `Salam hangat,\n*${company.name}*`;
  } else if (messageType === 'overdue') {
    text = `Halo Kak ${clientName}${companyName}, semoga dalam keadaan baik! 🙏\n\n` +
      `Kami dari finance *${company.name}* ingin menindaklanjuti perihal invoice berikut yang telah melewati tanggal jatuh tempo:\n\n` +
      `📄 *No. Invoice:* ${invoice.invoiceNumber}\n` +
      `💰 *Total Tagihan:* *${total}*\n` +
      `⚠️ *Jatuh Tempo:* ${dueDate}\n\n` +
      `Mohon informasinya apakah proses pembayaran sudah dapat dijadwalkan hari ini? Detail rekening pembayaran:\n` +
      `🏦 *${company.bankName}*: ${company.accountNumber} (a/n ${company.accountHolder})\n\n` +
      `Apabila sudah melakukan pembayaran, mohon abaikan pesan ini dan berkenan mengirimkan buktinya ya Kak. Terima kasih atas pengertiannya! 🙏`;
  } else {
    text = `Halo Kak ${clientName}${companyName}! 🎉\n\n` +
      `Kami mengonfirmasi bahwa pembayaran untuk Invoice *${invoice.invoiceNumber}* sebesar *${total}* telah kami terima dengan lunas.\n\n` +
      `Terima kasih banyak atas kepercayaan Kakak dan tim kepada *${company.name}*. Sukses selalu untuk project dan bisnisnya! 🚀✨`;
  }

  const encoded = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
