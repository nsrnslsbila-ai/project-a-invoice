import { Invoice, CompanyProfile } from '@/types/invoice';

const INVOICE_STORAGE_KEY = 'projecta_invoices_v1';
const COMPANY_STORAGE_KEY = 'projecta_company_v1';

export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  name: 'PROJECT-A',
  tagline: 'One-stop creative solution',
  address: 'Jl. Abuserin IV No. 38 RW. 6, Gandaria Sel., Kec. Cilandak, Kota Jakarta Selatan, DKI Jakarta 12420',
  email: 'projecta0201@gmail.com',
  phone: '087775212003',
  website: 'https://project-a-website-final.vercel.app',
  bankName: 'Bank Negara Indonesia (BNI)',
  accountNumber: '0395362142',
  accountHolder: 'REINALDI CHAIRAHMANDIKA',
  secondaryBankName: 'Bank Central Asia (BCA)',
  secondaryAccountNumber: '8830918231',
  secondaryAccountHolder: 'PROJECT-A CREATIVE',
};

export const INITIAL_SEED_INVOICES: Invoice[] = [
  {
    id: 'inv-seed-1',
    invoiceNumber: 'PA/2026/XI/001',
    client: {
      name: 'Aditya Prasetya',
      company: 'Project-A Client Partner',
      email: 'aditya@gmail.com',
      phone: '085694000538',
      address: 'Jakarta Selatan',
    },
    issueDate: '2026-11-02',
    dueDate: '2026-11-16',
    status: 'menunggak',
    items: [
      {
        id: 'item-1',
        category: 'Manage',
        name: 'Social Media Management - Starter Plan',
        description: '15 Feed Posts + 20 Stories, Copywriting, Content Calendar & Monthly Report',
        quantity: 1,
        unit: 'Bulan',
        unitPrice: 3500000,
        total: 3500000,
      },
    ],
    subtotal: 3500000,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    taxRate: 0,
    taxAmount: 0,
    grandTotal: 3500000,
    paymentTerms: 'Pembayaran dapat ditransfer ke rekening resmi PROJECT-A Studio. Jatuh tempo 14 hari.',
    notes: 'Terima kasih atas kerjasamanya! File deliverables resolusi tinggi diserahkan setelah pelunasan invoice.',
    createdAt: '2026-11-02T10:00:00Z',
    updatedAt: '2026-11-02T10:00:00Z',
  },
  {
    id: 'inv-seed-2',
    invoiceNumber: 'PA/2026/X/015',
    client: {
      name: 'Ms. Dany',
      company: 'Cambridge English',
      email: 'dany.cambridge@gmail.com',
      phone: '081299887766',
      address: 'Jakarta',
    },
    issueDate: '2026-10-26',
    dueDate: '2026-11-09',
    status: 'dibayar',
    paymentReceivedDate: '2026-11-01',
    items: [
      {
        id: 'item-2',
        category: 'Create',
        name: 'Video Editing, Color Grading, & Motion Graphic',
        description: 'Penyuntingan video promosi program Cambridge English, kinetic typography & sound design',
        quantity: 1,
        unit: 'Bulan',
        unitPrice: 3500000,
        total: 3500000,
      },
    ],
    subtotal: 3500000,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    taxRate: 0,
    taxAmount: 0,
    grandTotal: 3500000,
    paymentTerms: 'Term of payment: Pembayaran lunas 100%.',
    notes: 'Terima kasih banyak! Seluruh video reels sudah diserahkan di Google Drive.',
    createdAt: '2026-10-26T09:15:00Z',
    updatedAt: '2026-11-01T14:30:00Z',
  },
];

export function loadInvoices(): Invoice[] {
  if (typeof window === 'undefined') return INITIAL_SEED_INVOICES;
  try {
    const data = localStorage.getItem(INVOICE_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(INITIAL_SEED_INVOICES));
      return INITIAL_SEED_INVOICES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEED_INVOICES;
  } catch (err) {
    console.error('Error loading invoices from storage', err);
    return INITIAL_SEED_INVOICES;
  }
}

export function saveInvoices(invoices: Invoice[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoices));
  } catch (err) {
    console.error('Error saving invoices to storage', err);
  }
}

export function loadCompanyProfile(): CompanyProfile {
  if (typeof window === 'undefined') return DEFAULT_COMPANY_PROFILE;
  try {
    const data = localStorage.getItem(COMPANY_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(DEFAULT_COMPANY_PROFILE));
      return DEFAULT_COMPANY_PROFILE;
    }
    const parsed = JSON.parse(data);
    // Ensure name is PROJECT-A
    if (parsed.name === 'REI Creative Studio') {
      parsed.name = 'PROJECT-A';
      parsed.tagline = 'One-stop creative solution';
      parsed.website = 'https://project-a-website-final.vercel.app';
      parsed.email = 'projecta0201@gmail.com';
      parsed.phone = '087775212003';
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error('Error loading company profile', err);
    return DEFAULT_COMPANY_PROFILE;
  }
}

export function saveCompanyProfile(profile: CompanyProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving company profile', err);
  }
}

export function exportDataAsJSON(invoices: Invoice[], company: CompanyProfile): void {
  const exportData = {
    app: 'PROJECT-A — One-Stop Creative Solution Invoice System',
    version: '2.0',
    exportDate: new Date().toISOString(),
    company,
    invoices,
  };
  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PROJECT-A-Invoice-Backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
