'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  ArrowRight,
  Plus,
  Save,
  X,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { ServicePreset } from '@/types/invoice';
import { formatIDR } from '@/lib/format';

interface CatalogViewProps {
  services: ServicePreset[];
  onSelectServiceToInvoice: (preset: ServicePreset) => void;
  onAddService: (newService: ServicePreset) => void;
  onUpdateService: (updatedService: ServicePreset) => void;
  onDeleteService: (serviceId: string) => void;
  onResetServices: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  services,
  onSelectServiceToInvoice,
  onAddService,
  onUpdateService,
  onDeleteService,
  onResetServices,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServicePreset | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Create');
  const [formDescription, setFormDescription] = useState('');
  const [formUnit, setFormUnit] = useState('Project');
  const [formPrice, setFormPrice] = useState<number>(5000000);

  const pillars = ['all', 'Manage', 'Create', 'Grow'];

  const filteredServices = services.filter(item => {
    const matchPillar = selectedPillar === 'all' || item.category.toLowerCase() === selectedPillar.toLowerCase();
    const matchSearch = searchTerm.trim() === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchPillar && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormName('');
    setFormCategory('Create');
    setFormDescription('');
    setFormUnit('Project');
    setFormPrice(5000000);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: ServicePreset) => {
    setEditingService(service);
    setFormName(service.name);
    setFormCategory(service.category);
    setFormDescription(service.description);
    setFormUnit(service.unit);
    setFormPrice(service.suggestedPrice);
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Nama layanan wajib diisi.');
      return;
    }

    if (editingService) {
      // Update
      onUpdateService({
        ...editingService,
        name: formName.trim(),
        category: formCategory.trim(),
        description: formDescription.trim(),
        unit: formUnit.trim(),
        suggestedPrice: Number(formPrice) || 0,
      });
    } else {
      // Add
      const newService: ServicePreset = {
        id: `pa-custom-${Date.now()}`,
        name: formName.trim(),
        category: formCategory.trim(),
        description: formDescription.trim(),
        unit: formUnit.trim(),
        suggestedPrice: Number(formPrice) || 0,
        isCustom: true,
      };
      onAddService(newService);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>PROJECT-A • One-Stop Creative Solution Rate Card</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Katalog Layanan & Rate Card
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Daftar paket solusi terintegrasi PROJECT-A (Manage, Create, Grow). Anda dapat menambah paket baru, mengedit harga/deskripsi, menghapus layanan, atau langsung membuat invoice dengan 1-klik.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              if (confirm('Kembalikan seluruh daftar layanan ke standar resmi PROJECT-A (18 Layanan)?')) {
                onResetServices();
              }
            }}
            title="Reset ke Daftar Layanan Default PROJECT-A"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Default</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Layanan</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari layanan (contoh: social media, TVC, OOH billboard, 3D motion, activation, web)..."
            className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center gap-1.5">
            {pillars.map(pillar => (
              <button
                key={pillar}
                onClick={() => setSelectedPillar(pillar)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedPillar === pillar
                    ? 'bg-orange-500 text-zinc-950 font-bold shadow-md shadow-orange-500/25'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                {pillar === 'all' ? 'Semua Pilar Layanan' : `Pilar: ${pillar}`}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-zinc-400 whitespace-nowrap hidden sm:block">
            Menampilkan <strong className="text-white">{filteredServices.length}</strong> layanan
          </div>
        </div>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredServices.map(service => {
          const isManage = service.category.toLowerCase().includes('manage');
          const isGrow = service.category.toLowerCase().includes('grow');
          const badgeClass = isManage 
            ? 'text-sky-400 bg-sky-500/10 border-sky-500/20' 
            : isGrow 
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
            : 'text-orange-400 bg-orange-500/10 border-orange-500/20';

          return (
            <div
              key={service.id}
              className="bg-zinc-900/70 hover:bg-zinc-900/95 border border-zinc-800/80 hover:border-orange-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${badgeClass}`}>
                    {service.category}
                  </span>

                  {/* Actions for Edit and Delete */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(service)}
                      title="Edit Layanan & Harga"
                      className="p-1.5 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus layanan "${service.name}" dari katalog?`)) {
                          onDeleteService(service.id);
                        }
                      }}
                      title="Hapus Layanan"
                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
                    {service.name}
                  </h3>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Satuan: <strong className="text-zinc-400">{service.unit}</strong>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block tracking-wider font-semibold">Rate Standar</span>
                  <span className="text-sm font-extrabold text-white font-mono">
                    {formatIDR(service.suggestedPrice)}
                  </span>
                </div>

                <button
                  onClick={() => onSelectServiceToInvoice(service)}
                  className="flex items-center gap-1.5 bg-orange-500/15 hover:bg-orange-500 text-orange-300 hover:text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-xl border border-orange-500/30 hover:border-transparent transition-all"
                >
                  <span>+ Tagihkan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add or Edit Service */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {editingService ? 'Edit Layanan & Rate Card' : 'Tambah Layanan Baru PROJECT-A'}
                  </h3>
                  <p className="text-xs text-zinc-400">Atur nama jasa, pilar, deskripsi cakupan, satuan, dan harga standar.</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Nama Layanan / Solusi Kreatif *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: TikTok & Reels Creator Retainer"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Pilar / Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Manage">Manage (Strategy & Rhythm)</option>
                    <option value="Create">Create (Campaign & Production)</option>
                    <option value="Grow">Grow (Marketing & Optimization)</option>
                    <option value="Custom Solution">Custom Solution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Satuan (Unit)</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="Bulan, Project, Video, Paket, Spot..."
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Rate Standar (Rp) *</label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={formPrice}
                  onChange={(e) => setFormPrice(Math.max(0, parseInt(e.target.value) || 0))}
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500"
                />
                <div className="text-[11px] text-orange-400 font-mono mt-1">
                  Preview: {formatIDR(formPrice)}
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Deskripsi Deliverables & Cakupan Kerja</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Rincian deliverables, durasi, jumlah postingan, output yang diterima klien..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800/80"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold px-5 py-2 rounded-xl shadow-lg shadow-orange-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingService ? 'Simpan Perubahan' : 'Tambah Layanan'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
