'use client';

import React, { useState } from 'react';
import { Settings, X, Save, Building2, CreditCard, Check } from 'lucide-react';
import { CompanyProfile } from '@/types/invoice';

interface SettingsModalProps {
  company: CompanyProfile;
  onSave: (updated: CompanyProfile) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  company,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<CompanyProfile>({ ...company });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof CompanyProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Pengaturan Profil PROJECT-A & Rekening Bank</h3>
              <p className="text-xs text-zinc-400">Informasi ini dicetak otomatis pada header & footer invoice resmi PROJECT-A.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Studio Profile */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-orange-400 font-bold border-b border-zinc-800 pb-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Profil Agensi & Identitas Brand</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Nama Brand / Studio</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Tagline / Slogan</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">No. WhatsApp Resmi</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Email Resmi</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1 font-medium">Alamat Kantor / Studio</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1 font-medium">Website URL</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Bank Accounts */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-orange-400 font-bold border-b border-zinc-800 pb-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Rekening Pembayaran Utama & Cadangan</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="text-[11px] font-bold text-zinc-300">Rekening Utama:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-zinc-500 mb-1">Nama Bank</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    placeholder="Bank Negara Indonesia (BNI)"
                    required
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1">Nomor Rekening</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                    placeholder="0395362142"
                    required
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1">Atas Nama (A/N)</label>
                  <input
                    type="text"
                    value={formData.accountHolder}
                    onChange={(e) => handleChange('accountHolder', e.target.value)}
                    placeholder="REINALDI CHAIRAHMANDIKA"
                    required
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="text-[11px] font-bold text-zinc-300">Rekening Cadangan (Opsional):</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-zinc-500 mb-1">Nama Bank</label>
                  <input
                    type="text"
                    value={formData.secondaryBankName || ''}
                    onChange={(e) => handleChange('secondaryBankName', e.target.value)}
                    placeholder="BCA"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1">Nomor Rekening</label>
                  <input
                    type="text"
                    value={formData.secondaryAccountNumber || ''}
                    onChange={(e) => handleChange('secondaryAccountNumber', e.target.value)}
                    placeholder="8830918231"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1">Atas Nama (A/N)</label>
                  <input
                    type="text"
                    value={formData.secondaryAccountHolder || ''}
                    onChange={(e) => handleChange('secondaryAccountHolder', e.target.value)}
                    placeholder="PROJECT-A CREATIVE"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Footer Save Button */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800/80"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold px-5 py-2 rounded-xl shadow-lg shadow-orange-500/20"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-950 font-black" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
