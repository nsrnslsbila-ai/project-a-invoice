'use client';

import React from 'react';
import { 
  FileText, 
  LayoutDashboard, 
  PlusCircle, 
  Sparkles, 
  Settings, 
  Download, 
  Layers
} from 'lucide-react';
import { CompanyProfile } from '@/types/invoice';

interface NavbarProps {
  activeTab: 'dashboard' | 'invoices' | 'create' | 'catalog';
  setActiveTab: (tab: 'dashboard' | 'invoices' | 'create' | 'catalog') => void;
  company: CompanyProfile;
  onOpenSettings: () => void;
  onExportBackup: () => void;
  invoicesCount: number;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  company,
  onOpenSettings,
  onExportBackup,
  invoicesCount,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-[#171717]/90 backdrop-blur-md print:hidden no-print" data-print-hidden="true">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Studio Name: PROJECT-A */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00] flex items-center justify-center shadow-lg shadow-orange-500/25 ring-1 ring-white/20 transition-transform group-hover:scale-105">
              <span className="font-black text-xl tracking-tighter text-zinc-950 font-mono">PA</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">PROJECT-A</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  INVOICE
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block truncate max-w-[260px]">
                {company.tagline || 'One-stop creative solution'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-orange-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard Overview
            </button>

            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'invoices'
                  ? 'bg-orange-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              History Invoice
              {invoicesCount > 0 && (
                <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full border ${
                  activeTab === 'invoices' ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}>
                  {invoicesCount}
                </span>
              )}
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" title={`${pendingCount} invoice menunggak`} />
              )}
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-orange-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Katalog Layanan
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExportBackup}
              title="Backup Data JSON"
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg border border-zinc-800/80 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSettings}
              title="Pengaturan Rekening & Profil PROJECT-A"
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg border border-zinc-800/80 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Invoice</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-zinc-800 text-xs bg-[#171717]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-md ${
              activeTab === 'dashboard' ? 'text-orange-400 font-bold' : 'text-zinc-400'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-md ${
              activeTab === 'invoices' ? 'text-orange-400 font-bold' : 'text-zinc-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Invoice ({invoicesCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 py-1 px-2 rounded-md ${
              activeTab === 'catalog' ? 'text-orange-400 font-bold' : 'text-zinc-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layanan</span>
          </button>
        </div>

      </div>
    </header>
  );
};
