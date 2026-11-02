'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Save, 
  ArrowLeft, 
  Layers, 
  Calendar, 
  CreditCard, 
  User, 
  FileText,
  DollarSign,
  Percent,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  Invoice, 
  InvoiceItem, 
  InvoiceStatus, 
  ServiceCategory, 
  CompanyProfile,
  ServicePreset 
} from '@/types/invoice';
import { formatIDR, generateInvoiceNumber } from '@/lib/format';

interface InvoiceFormProps {
  initialInvoice?: Invoice | null;
  company: CompanyProfile;
  services: ServicePreset[];
  existingCount: number;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialInvoice,
  company,
  services,
  existingCount,
  onSave,
  onCancel,
}) => {
  // Client state
  const [clientName, setClientName] = useState(initialInvoice?.client.name || '');
  const [clientCompany, setClientCompany] = useState(initialInvoice?.client.company || '');
  const [clientEmail, setClientEmail] = useState(initialInvoice?.client.email || '');
  const [clientPhone, setClientPhone] = useState(initialInvoice?.client.phone || '');
  const [clientAddress, setClientAddress] = useState(initialInvoice?.client.address || '');

  // Invoice metadata
  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoiceNumber || generateInvoiceNumber(existingCount)
  );
  const [issueDate, setIssueDate] = useState(
    initialInvoice?.issueDate || new Date().toISOString().slice(0, 10)
  );
  
  // Default due date: +14 days from issue date
  const [dueDate, setDueDate] = useState(() => {
    if (initialInvoice?.dueDate) return initialInvoice.dueDate;
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });

  const [status, setStatus] = useState<InvoiceStatus>(initialInvoice?.status || 'menunggak');

  // Items list
  const [items, setItems] = useState<InvoiceItem[]>(() => {
    if (initialInvoice?.items && initialInvoice.items.length > 0) {
      return initialInvoice.items;
    }
    // Default initial Project-A item
    return [
      {
        id: 'item-initial-1',
        category: 'Manage',
        name: 'Social Media Management - Starter Plan',
        description: '15 Feed Posts + 20 Stories, Copywriting, Content Calendar & Monthly Report',
        quantity: 1,
        unit: 'Bulan',
        unitPrice: 3500000,
        total: 3500000,
      },
    ];
  });

  // Financial discounts & taxes
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(
    initialInvoice?.discountType || 'percentage'
  );
  const [discountValue, setDiscountValue] = useState<number>(initialInvoice?.discountValue || 0);
  const [taxRate, setTaxRate] = useState<number>(initialInvoice?.taxRate || 0);

  // Notes & terms
  const [paymentTerms, setPaymentTerms] = useState(
    initialInvoice?.paymentTerms || 'Pembayaran dapat ditransfer ke rekening resmi PROJECT-A Studio. Jatuh tempo 14 hari.'
  );
  const [notes, setNotes] = useState(
    initialInvoice?.notes || 'Terima kasih atas kerjasamanya! File deliverables resolusi tinggi diserahkan setelah pelunasan invoice.'
  );

  // Preset picker modal toggle
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetSearch, setPresetSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Recalculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);

  const discountAmount = discountType === 'percentage' 
    ? Math.round((subtotal * (discountValue || 0)) / 100)
    : Number(discountValue || 0);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * (taxRate || 0)) / 100);
  const grandTotal = Math.max(0, taxableAmount + taxAmount);

  // Add a blank custom item
  const handleAddBlankItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      category: 'Create',
      name: '',
      description: '',
      quantity: 1,
      unit: 'Project',
      unitPrice: 0,
      total: 0,
    };
    setItems(prev => [...prev, newItem]);
  };

  // Add preset item
  const handleAddPreset = (preset: ServicePreset) => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      category: preset.category,
      name: preset.name,
      description: preset.description,
      quantity: 1,
      unit: preset.unit,
      unitPrice: preset.suggestedPrice,
      total: preset.suggestedPrice * 1,
    };
    setItems(prev => [...prev, newItem]);
    setShowPresetModal(false);
  };

  // Update item field
  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          const qty = field === 'quantity' ? Number(value) : item.quantity;
          const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
          updated.total = Math.max(0, qty * price);
        }
        return updated;
      })
    );
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      alert('Invoice harus memiliki minimal 1 item layanan.');
      return;
    }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Submit invoice
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      alert('Harap masukkan nama klien / PIC.');
      return;
    }

    if (items.some(i => !i.name.trim())) {
      alert('Semua item layanan harus memiliki nama jasa.');
      return;
    }

    const now = new Date().toISOString();
    const invoiceData: Invoice = {
      id: initialInvoice?.id || `inv-${Date.now()}`,
      invoiceNumber: invoiceNumber.trim() || generateInvoiceNumber(existingCount),
      client: {
        name: clientName.trim(),
        company: clientCompany.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        address: clientAddress.trim(),
      },
      issueDate,
      dueDate,
      status,
      items,
      subtotal,
      discountType,
      discountValue: Number(discountValue || 0),
      discountAmount,
      taxRate: Number(taxRate || 0),
      taxAmount,
      grandTotal,
      paymentTerms,
      notes,
      createdAt: initialInvoice?.createdAt || now,
      updatedAt: now,
    };

    onSave(invoiceData);
  };

  // Filtered presets for modal
  const filteredPresets = services.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = presetSearch.trim() === '' || 
      p.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(presetSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header Form */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {initialInvoice ? 'Edit Invoice' : 'Buat Invoice Baru PROJECT-A'}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Isi detail klien, pilih layanan dari solusi terintegrasi PROJECT-A, dan atur status pembayaran.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-zinc-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Invoice</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Invoice Meta & Status */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
            <FileText className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white">Detail & Status Invoice</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Invoice Number */}
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Nomor Invoice</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Issue Date */}
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Tanggal Dibuat</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Jatuh Tempo (Due Date)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Status Pembayaran</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="menunggak">🟡 Menunggak (Belum Bayar)</option>
                <option value="follow_up">🔵 Sudah di-Follow Up</option>
                <option value="dibayar">🟢 Dibayar (Lunas)</option>
                <option value="draft">⚪ Draft</option>
                <option value="dibatalkan">🔴 Dibatalkan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Client Information */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
            <User className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white">Informasi Klien / Partner Brand</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">
                Nama Klien / PIC <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">
                Nama Brand / Perusahaan
              </label>
              <input
                type="text"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                placeholder="Contoh: SKIN+ / Indosat / Brand Co."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">
                No. WhatsApp (Untuk Follow-up) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Contoh: 08123456789"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Email Klien</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="klien@gmail.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-400 mb-1.5 font-medium">Alamat / Lokasi Klien</label>
              <input
                type="text"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="Contoh: Jakarta Selatan, Indonesia"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Dynamic Creative Items */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <div>
                <h2 className="text-sm font-bold text-white">Rincian Layanan & Harga</h2>
                <p className="text-[11px] text-zinc-400">
                  Tambahkan item layanan, masukkan kuantitas dan harga satuan dalam Rupiah.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setShowPresetModal(true)}
                className="flex items-center gap-1.5 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Pilih dari Katalog PROJECT-A</span>
              </button>

              <button
                type="button"
                onClick={handleAddBlankItem}
                className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium px-3 py-1.5 rounded-xl border border-zinc-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Item Custom</span>
              </button>
            </div>
          </div>

          {/* Table of items */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold flex items-center justify-center border border-orange-500/20">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                      placeholder="Kategori (Manage, Create, Grow...)"
                      className="bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-orange-300 font-medium px-2.5 py-1 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Hapus baris ini"
                    className="text-zinc-500 hover:text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Item Inputs Row 1: Name & Scope */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Nama Layanan / Pekerjaan</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                      placeholder="Contoh: Social Media Management, TVC, Motion 3D..."
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Deskripsi Deliverable / Catatan Pekerjaan</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                      placeholder="Detail cakupan deliverable, durasi, jumlah konten..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Item Inputs Row 2: Qty, Unit, Unit Price, Total */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Jumlah (Qty)</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Satuan</label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                      placeholder="Project, Video, Bulan, Spot..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Harga Satuan (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      step="50000"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Math.max(0, parseInt(e.target.value) || 0))}
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Total Item</label>
                    <div className="w-full bg-zinc-900/50 border border-zinc-800/60 rounded-xl px-3 py-2 text-orange-400 font-mono font-bold">
                      {formatIDR(item.total)}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Calculation, Discounts & Taxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Notes & Bank info */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <CreditCard className="w-4 h-4 text-orange-400" />
              <h3 className="font-bold text-white">Ketentuan & Rekening Pembayaran</h3>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Syarat & Ketentuan (Terms of Payment)</label>
              <textarea
                rows={2}
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Catatan Tambahan untuk Klien</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl text-[11px] text-zinc-400 space-y-1">
              <div className="font-semibold text-zinc-200">Rekening Tujuan Transfer:</div>
              <div>• {company.bankName}: <strong className="text-white font-mono">{company.accountNumber}</strong> a/n {company.accountHolder}</div>
              {company.secondaryBankName && (
                <div>• {company.secondaryBankName}: <strong className="text-white font-mono">{company.secondaryAccountNumber}</strong> a/n {company.secondaryAccountHolder}</div>
              )}
            </div>
          </div>

          {/* Right: Subtotal, Discount, Tax, Grand Total */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-3.5 shadow-sm text-xs">
            <h3 className="font-bold text-white border-b border-zinc-800 pb-2">
              Ringkasan Pembayaran
            </h3>

            {/* Subtotal */}
            <div className="flex items-center justify-between text-zinc-300">
              <span>Subtotal ({items.length} item)</span>
              <span className="font-mono font-medium">{formatIDR(subtotal)}</span>
            </div>

            {/* Discount */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Diskon</span>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-0.5 text-zinc-300 text-[11px]"
                >
                  <option value="percentage">% Persen</option>
                  <option value="fixed">Rp Nominal</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="w-24 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-right text-white font-mono"
                />
                <span className="font-mono text-rose-400">-{formatIDR(discountAmount)}</span>
              </div>
            </div>

            {/* Tax */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Pajak / PPN (%)</span>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-0.5 text-zinc-300 text-[11px]"
                >
                  <option value="0">Tanpa PPN (0%)</option>
                  <option value="11">PPN 11%</option>
                  <option value="12">PPN 12%</option>
                </select>
              </div>

              <span className="font-mono text-zinc-300">+{formatIDR(taxAmount)}</span>
            </div>

            {/* Grand Total */}
            <div className="border-t border-zinc-700/80 pt-3 flex items-center justify-between text-sm">
              <span className="font-bold text-white">Grand Total Tagihan</span>
              <span className="text-xl font-extrabold text-orange-400 font-mono tracking-tight">
                {formatIDR(grandTotal)}
              </span>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold text-sm py-3 rounded-xl shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.01]"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Invoice PROJECT-A</span>
              </button>
            </div>

          </div>

        </div>

      </form>

      {/* Preset Service Catalog Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  Katalog Layanan PROJECT-A
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Klik layanan untuk langsung memasukkannya ke dalam tabel invoice.
                </p>
              </div>
              <button
                onClick={() => setShowPresetModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            {/* Filter & Search */}
            <div className="p-4 border-b border-zinc-800/80 space-y-3 bg-zinc-950/50 text-xs">
              <input
                type="text"
                value={presetSearch}
                onChange={(e) => setPresetSearch(e.target.value)}
                placeholder="Cari layanan (e.g., social media, TVC, motion, activation, web)..."
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['all', 'Manage', 'Create', 'Grow'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors font-medium ${
                      selectedCategory === cat
                        ? 'bg-orange-500 text-zinc-950 font-bold'
                        : 'bg-zinc-800/70 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cat === 'all' ? 'Semua Pilar' : `Pilar: ${cat}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets List */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-zinc-800/50">
              {filteredPresets.map(preset => (
                <div
                  key={preset.id}
                  onClick={() => handleAddPreset(preset)}
                  className="pt-2.5 first:pt-0 flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/50 cursor-pointer transition-colors group"
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                        {preset.category}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                        {preset.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{preset.description}</p>
                    <div className="text-[10px] text-zinc-500">Satuan: {preset.unit}</div>
                  </div>

                  <div className="text-right whitespace-nowrap">
                    <div className="text-xs font-bold text-white font-mono">{formatIDR(preset.suggestedPrice)}</div>
                    <span className="text-[10px] text-orange-400 font-bold group-hover:underline">
                      + Masukkan
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
