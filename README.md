# 📄 REI Creative Studio — Invoice & Omzet Management System

Aplikasi web manajemen invoice, pelacakan piutang (*cashflow monitoring*), dan follow-up otomatis tagihan klien via WhatsApp yang dirancang khusus untuk agensi & profesional kreatif (**Social Media Management, Content Creation, Motion Design, Video Editing, Photo Editing, dan UI/UX & Website Development**).

---

## 🌟 Fitur Utama & Kemampuan Sistem

### 1. Dashboard Overview Omzet & Cashflow
- **Total Omzet Dibuat**: Nilai akumulatif dari semua invoice aktif yang diterbitkan.
- **Omzet Terbayar (Lunas)**: Uang riil yang sudah masuk ke rekening REI dengan persentase realisasi kas.
- **Menunggak (Belum Bayar)**: Total piutang yang masih menunggu pembayaran atau telah melewati tempo.
- **Sudah di-Follow Up**: Invoice yang telah dikirimi pengingat WhatsApp ke klien.
- **Multi-segment Cashflow Bar**: Visualisasi perbandingan dana masuk vs piutang berjalan.
- **Layanan Kreatif Terlaris**: Ranking omzet berdasarkan kategori (Social Media, Video, Motion, Web & UI/UX, dll.).
- **Invoice Perlu Perhatian Segera**: Daftar tagihan jatuh tempo (*overdue*) dengan tombol aksi cepat (WA Follow Up & Tandai Lunas).

### 2. Pembuatan Invoice Fleksibel (Invoice Creator)
- **Auto-Generate Nomor Invoice**: Format resmi agensi (contoh: `REI/2026/XI/001`) dan tanggal jatuh tempo otomatis.
- **Data Klien Lengkap**: Nama PIC, Brand/Perusahaan, Nomor WhatsApp (tervalidasi format internasional), Email, dan Alamat.
- **Dynamic Multi-Item Builder**:
  - Tambah & hapus baris layanan tanpa batas.
  - Masukkan nama jasa, cakupan deliverables, kuantitas (Qty), satuan (Project, Video, Bulan, Paket, Foto, Asset, dll.), dan harga satuan dalam Rupiah.
  - Perhitungan otomatis subtotal per baris dan keseluruhan.
- **Katalog Layanan Kreatif REI (Rate Card Preset)**:
  - 1-Klik memasukkan paket jasa standar seperti:
    - *Social Media Management*: Starter (Rp 3.5jt), Growth (Rp 6.5jt), Full Creative Retainer (Rp 12.5jt).
    - *Video Editing*: Short-form Reels/TikTok (Rp 400rb/video atau Rp 1.75jt/paket 5 video), YouTube Long-form (Rp 1.8jt), Commercial Video Ads (Rp 4.5jt).
    - *Motion Design*: Animated Logo (Rp 1.5jt), 2D Motion Explainer (Rp 3.8jt), 3D Product Animation Cinema 4D (Rp 7.5jt).
    - *Commercial Photo Editing*: High-end retouching & color grading katalog (Rp 1.5jt/paket).
    - *UI/UX & Web Development*: Figma Landing Page (Rp 4.5jt), Next.js Website (Rp 6.5jt), Fullstack Custom App (Rp 16jt).
    - *Branding & Graphic Design*: Brand Identity Suite (Rp 5.5jt), Pitch Deck (Rp 2.5jt).
- **Perhitungan Finansial Akurat**:
  - Diskon (% persentase atau nominal Rp).
  - Pajak PPN (0%, 11%, atau custom).
  - Grand Total kalkulasi otomatis *real-time*.
- **Instruksi Transfer & Rekening**:
  - Rekening Bank BCA & Bank Mandiri resmi REI Studio, terms of payment (DP 50%, termin, hak cipta deliverable).

### 3. Riwayat Invoice & Pembaruan Status
- Filter cepat berdasarkan status: **Semua**, **Menunggak**, **Sudah Follow Up**, **Dibayar (Lunas)**, dan **Draft**.
- Pencarian instan berdasarkan nama klien, nama brand, nomor invoice, atau jenis layanan.
- **Ubah Status 1-Klik**: Dropdown langsung dari tabel daftar tanpa harus masuk ke form edit.
- **Selebrasi Konfeti**: Efek visual konfeti saat invoice berhasil ditandai sebagai "Dibayar (Lunas)".

### 4. Generator Pesan WhatsApp Follow-Up Otomatis
- Tombol langsung membuka WhatsApp Web atau WhatsApp Desktop dengan nomor klien yang sudah diformat (`628xxx`).
- 3 Pilihan Template Pesan Profesional:
  1. **Reminder Sopan / Tagihan Rutin**: Pengingat ramah menjelang jatuh tempo dengan detail no invoice, rincian jasa, total tagihan, dan nomor rekening.
  2. **Tagihan Jatuh Tempo (Overdue)**: Penegasan profesional untuk invoice yang sudah lewat tempo pembayaran.
  3. **Konfirmasi Pembayaran Lunas**: Ucapan terima kasih resmi setelah dana diterima.
- Tombol salin pesan (*copy to clipboard*) dan tombol otomatis ubah status ke "Sudah Follow Up".

### 5. Cetak & Simpan PDF Siap Pakai (A4 Document)
- Tampilan invoice formal dengan rasio kertas standar A4.
- Dilengkapi watermark status (*PAID / LUNAS*, *MENUNGGAK*, *FOLLOW UP*), tanda tangan digital, dan cap stempel resmi REI Creative Studio.
- `@media print` CSS teroptimasi: Ketika memilih Cetak / Save as PDF dari browser, seluruh menu navigasi otomatis disembunyikan sehingga menghasilkan PDF invoice yang bersih dan tajam.

### 6. Keamanan & Backup Data
- Menggunakan browser persistent storage (`localStorage`) sehingga data tersimpan otomatis.
- Fitur **Export Backup JSON** untuk mengamankan data invoice dan profil rekening ke file cadangan.

---

## 💻 Menjalankan Secara Lokal

Website ini dibangun menggunakan **Next.js 14 (App Router)** dan **Tailwind CSS**.

### 1. Masuk ke Direktori Proyek
```bash
cd /Users/creative-rei/.gemini/antigravity/scratch/invoice-rei
```

### 2. Mode Pengembangan (Development)
```bash
npm run dev
```
Akses di browser: `http://localhost:3000` atau `http://localhost:3001`

### 3. Mode Produksi (Production Build)
```bash
npm run build
npm run start -- -p 3001
```

---

## 🚀 Deploy Live ke Vercel

Proyek ini 100% kompatibel dan sudah disiapkan untuk Vercel:

### Opsi A: Deploy Langsung via Vercel CLI (Paling Cepat)
Buka Terminal di direktori proyek dan jalankan:
```bash
cd /Users/creative-rei/.gemini/antigravity/scratch/invoice-rei
vercel
```
Ikuti panduan singkat:
- *Set up and deploy?* Tekan **Y**
- *Which scope?* Pilih akun Vercel Anda (**nsrnslsbila-5885** atau tim **THE CHAIR**)
- *Link to existing project?* Pilih **Y** lalu masukkan **rei-invoice** (proyek sudah kami buatkan di Vercel!)
- *Want to modify settings?* Tekan **N**

Untuk deploy ke production URL:
```bash
vercel --prod
```

### Opsi B: Deploy via GitHub (Auto CI/CD)
1. Push folder proyek ini ke repository GitHub baru Anda:
   ```bash
   git remote add origin https://github.com/<username>/rei-invoice.git
   git branch -M main
   git push -u origin main
   ```
2. Buka [Dashboard Vercel](https://vercel.com/dashboard)
3. Buka proyek **rei-invoice** -> *Settings* -> *Git* -> Connect ke repo GitHub Anda.
4. Setiap ada push kode, Vercel akan otomatis melakukan build dan deploy secara live!
