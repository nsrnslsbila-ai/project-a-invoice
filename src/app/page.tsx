'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from '@/components/Navbar';
import { DashboardView } from '@/components/DashboardView';
import { InvoiceList } from '@/components/InvoiceList';
import { InvoiceForm } from '@/components/InvoiceForm';
import { InvoicePreview } from '@/components/InvoicePreview';
import { WhatsAppModal } from '@/components/WhatsAppModal';
import { SettingsModal } from '@/components/SettingsModal';
import { CatalogView } from '@/components/CatalogView';
import { 
  Invoice, 
  InvoiceStatus, 
  CompanyProfile, 
  ServicePreset 
} from '@/types/invoice';
import { 
  loadInvoices, 
  saveInvoices, 
  loadCompanyProfile, 
  saveCompanyProfile, 
  exportDataAsJSON,
  DEFAULT_COMPANY_PROFILE,
  INITIAL_SEED_INVOICES 
} from '@/lib/storage';
import { 
  loadServices, 
  saveServices, 
  resetToDefaultServices,
  INITIAL_PROJECT_A_SERVICES 
} from '@/lib/presets';

export default function HomePage() {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_SEED_INVOICES);
  const [company, setCompany] = useState<CompanyProfile>(DEFAULT_COMPANY_PROFILE);
  const [services, setServices] = useState<ServicePreset[]>(INITIAL_PROJECT_A_SERVICES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'create' | 'catalog'>('dashboard');

  // Modals & Active editing state
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [previewingInvoice, setPreviewingInvoice] = useState<Invoice | null>(null);
  const [whatsAppInvoice, setWhatsAppInvoice] = useState<Invoice | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const loadedInvoices = loadInvoices();
    const loadedCompany = loadCompanyProfile();
    const loadedServices = loadServices();

    setInvoices(loadedInvoices);
    setCompany(loadedCompany);
    setServices(loadedServices);
    setIsLoaded(true);
  }, []);

  // Update Invoices State & LocalStorage
  const updateInvoicesState = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    saveInvoices(newInvoices);
  };

  // Update Services State & LocalStorage
  const updateServicesState = (newServices: ServicePreset[]) => {
    setServices(newServices);
    saveServices(newServices);
  };

  // Trigger celebration confetti (Project-A colors)
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#FF6B00', '#FFA133', '#10b981', '#f59e0b', '#ffffff'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Save or Update Invoice
  const handleSaveInvoice = (savedInvoice: Invoice) => {
    const exists = invoices.some(i => i.id === savedInvoice.id);
    let updatedList: Invoice[];

    if (exists) {
      updatedList = invoices.map(i => (i.id === savedInvoice.id ? savedInvoice : i));
    } else {
      updatedList = [savedInvoice, ...invoices];
    }

    updateInvoicesState(updatedList);

    if (savedInvoice.status === 'dibayar') {
      triggerCelebration();
    }

    setEditingInvoice(null);
    setPreviewingInvoice(savedInvoice);
    setActiveTab('invoices');
  };

  // Update Status
  const handleUpdateStatus = (invoiceId: string, newStatus: InvoiceStatus) => {
    const today = new Date().toISOString().slice(0, 10);
    const updated = invoices.map(inv => {
      if (inv.id !== invoiceId) return inv;

      const isBecomingPaid = newStatus === 'dibayar' && inv.status !== 'dibayar';
      if (isBecomingPaid) {
        triggerCelebration();
      }

      return {
        ...inv,
        status: newStatus,
        lastFollowUpDate: newStatus === 'follow_up' ? today : inv.lastFollowUpDate,
        followUpCount: newStatus === 'follow_up' ? (inv.followUpCount || 0) + 1 : inv.followUpCount,
        paymentReceivedDate: newStatus === 'dibayar' ? today : inv.paymentReceivedDate,
        updatedAt: new Date().toISOString(),
      };
    });

    updateInvoicesState(updated);
  };

  // Delete Invoice
  const handleDeleteInvoice = (invoiceId: string) => {
    const updated = invoices.filter(i => i.id !== invoiceId);
    updateInvoicesState(updated);
  };

  // Save Company Profile
  const handleSaveCompany = (updatedCompany: CompanyProfile) => {
    setCompany(updatedCompany);
    saveCompanyProfile(updatedCompany);
  };

  // Service Management Handlers
  const handleAddService = (newService: ServicePreset) => {
    const updated = [newService, ...services];
    updateServicesState(updated);
  };

  const handleUpdateService = (updatedService: ServicePreset) => {
    const updated = services.map(s => s.id === updatedService.id ? updatedService : s);
    updateServicesState(updated);
  };

  const handleDeleteService = (serviceId: string) => {
    const updated = services.filter(s => s.id !== serviceId);
    updateServicesState(updated);
  };

  const handleResetServices = () => {
    const reset = resetToDefaultServices();
    setServices(reset);
  };

  // Select service from catalog directly to create invoice
  const handleSelectServiceFromCatalog = (preset: ServicePreset) => {
    const newInvoiceStub: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: '',
      client: {
        name: '',
        company: '',
        email: '',
        phone: '',
        address: '',
      },
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 14);
        return d.toISOString().slice(0, 10);
      })(),
      status: 'menunggak',
      items: [
        {
          id: `item-${Date.now()}`,
          category: preset.category,
          name: preset.name,
          description: preset.description,
          quantity: 1,
          unit: preset.unit,
          unitPrice: preset.suggestedPrice,
          total: preset.suggestedPrice,
        },
      ],
      subtotal: preset.suggestedPrice,
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: 0,
      taxRate: 0,
      taxAmount: 0,
      grandTotal: preset.suggestedPrice,
      paymentTerms: 'Term of payment: 14 hari kerja sejak invoice diterbitkan.',
      notes: 'Terima kasih atas kepercayaannya pada PROJECT-A!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingInvoice(newInvoiceStub);
    setActiveTab('create');
  };

  const pendingCount = invoices.filter(i => i.status === 'menunggak').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-zinc-100 selection:bg-orange-500 selection:text-zinc-950">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'create') {
            setEditingInvoice(null);
          }
          setActiveTab(tab);
        }}
        company={company}
        onOpenSettings={() => setShowSettings(true)}
        onExportBackup={() => exportDataAsJSON(invoices, company)}
        invoicesCount={invoices.length}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 print:hidden no-print" data-print-hidden="true">
        {activeTab === 'dashboard' && (
          <DashboardView
            invoices={invoices}
            company={company}
            onCreateNew={() => {
              setEditingInvoice(null);
              setActiveTab('create');
            }}
            onViewInvoice={(inv) => setPreviewingInvoice(inv)}
            onUpdateStatus={handleUpdateStatus}
            onOpenWhatsApp={(inv) => setWhatsAppInvoice(inv)}
            onGoToInvoices={() => setActiveTab('invoices')}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoiceList
            invoices={invoices}
            company={company}
            onCreateNew={() => {
              setEditingInvoice(null);
              setActiveTab('create');
            }}
            onViewInvoice={(inv) => setPreviewingInvoice(inv)}
            onEditInvoice={(inv) => {
              setEditingInvoice(inv);
              setActiveTab('create');
            }}
            onDeleteInvoice={handleDeleteInvoice}
            onUpdateStatus={handleUpdateStatus}
            onOpenWhatsApp={(inv) => setWhatsAppInvoice(inv)}
          />
        )}

        {activeTab === 'create' && (
          <InvoiceForm
            initialInvoice={editingInvoice}
            company={company}
            services={services}
            existingCount={invoices.length}
            onSave={handleSaveInvoice}
            onCancel={() => {
              setEditingInvoice(null);
              setActiveTab('invoices');
            }}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogView
            services={services}
            onSelectServiceToInvoice={handleSelectServiceFromCatalog}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onDeleteService={handleDeleteService}
            onResetServices={handleResetServices}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-500 print:hidden no-print" data-print-hidden="true">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-zinc-300 font-bold">{company.name}</strong> • {company.tagline}
          </div>
          <div className="text-zinc-500">
            Manage • Create • Grow • Everywhere your brand needs to move.
          </div>
        </div>
      </footer>

      {/* Invoice Detail / Print Preview Modal */}
      {previewingInvoice && (
        <InvoicePreview
          invoice={previewingInvoice}
          company={company}
          onClose={() => setPreviewingInvoice(null)}
          onEdit={(inv) => {
            setPreviewingInvoice(null);
            setEditingInvoice(inv);
            setActiveTab('create');
          }}
          onOpenWhatsApp={(inv) => {
            setWhatsAppInvoice(inv);
          }}
        />
      )}

      {/* WhatsApp Follow-Up Modal */}
      {whatsAppInvoice && (
        <WhatsAppModal
          invoice={whatsAppInvoice}
          company={company}
          onClose={() => setWhatsAppInvoice(null)}
          onMarkFollowedUp={(id) => handleUpdateStatus(id, 'follow_up')}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          company={company}
          onSave={handleSaveCompany}
          onClose={() => setShowSettings(false)}
        />
      )}

    </div>
  );
}
