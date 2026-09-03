# Panduan Teknis Eksekusi (Untuk AI Agent)

> Dokumen ini adalah instruksi eksekusi. Baca `01-konsep-desain.md`, `02-struktur-fitur.md`, dan `03-spesifikasi-photobooth.md` terlebih dahulu sebagai konteks sebelum mulai coding.

## Rekomendasi Stack
- **HTML + CSS + JavaScript murni (vanilla)**, atau framework ringan (React/Vite) jika agent lebih terbiasa — pilih yang paling cepat menghasilkan output stabil.
- Tidak wajib backend/server — seluruh fitur (musik, photo booth, simpan foto) bisa berjalan 100% di sisi client/browser.
- Struktur file disarankan sederhana:
```
/index.html          → berisi dashboard + photo booth (SPA sederhana), atau
/dashboard.html
/photobooth.html
/style.css
/script.js
/assets/
   /music/lagu-ultah.mp3
   /images/frame-overlay.png (jika pakai overlay PNG siap pakai)
```

## Urutan Pengerjaan yang Disarankan
1. Bangun **struktur HTML** untuk 2 view: Dashboard & Photo Booth (sesuai `02-struktur-fitur.md`).
2. Terapkan **styling** sesuai palet warna & tipografi di `01-konsep-desain.md`, mobile-first (gunakan `max-width`, unit `rem`/`%`, media query untuk layar lebih besar).
3. Implementasi **audio player** untuk musik latar (tombol play/pause, handle kasus autoplay diblokir browser).
4. Implementasi **navigasi** antar Dashboard ↔ Photo Booth tanpa memutus musik (jika Single Page).
5. Implementasi **akses kamera** (`getUserMedia`) + live preview.
6. Implementasi **capture ke canvas** + gambar overlay/bingkai hijau di atasnya.
7. Implementasi **tombol simpan/unduh** hasil foto.
8. Tambahkan **animasi ringan** (confetti/balon) di dashboard — gunakan CSS animation atau library ringan, hindari library besar yang memperlambat load di mobile.
9. Uji coba di **viewport mobile** (gunakan device toolbar/emulator) sebagai prioritas utama, baru cek tampilan desktop.
10. Pastikan **permission handling** kamera & pesan error ramah (lihat edge case di `02-struktur-fitur.md`).

## Aturan Kode (Rules)
- **Mobile-first**: semua ukuran, tombol, dan layout dirancang dulu untuk layar kecil (~360–420px), baru disesuaikan ke layar lebih besar.
- **Client-side only**: jangan buat dependency ke backend/database kecuali diminta eksplisit oleh user nantinya.
- **Aksesibilitas dasar**: kontras teks-background cukup jelas (terutama teks di atas hijau — gunakan teks putih/hijau sangat gelap agar terbaca), tombol punya label yang jelas.
- **Performa**: kompres/optimalkan aset (gambar overlay, file musik) agar loading cepat di koneksi mobile.
- **Placeholder yang wajib disediakan agar mudah diisi user**:
  - `{{NAMA}}` → nama yang ulang tahun
  - `{{TEKS_UCAPAN}}` → isi ucapan personal
  - path file musik di `/assets/music/`
- Gunakan komentar kode secukupnya di bagian yang perlu dikustomisasi user (teks ucapan, warna, path file musik) agar mudah diedit tanpa paham programming mendalam.

## Definition of Done (Kriteria Selesai)
- [ ] Dashboard tampil dengan ucapan ulang tahun ke-17 + tema hijau sesuai palet.
- [ ] Musik bisa diputar (via tombol, autoplay dicoba tapi ada fallback tombol manual).
- [ ] Ada tombol/menu jelas menuju Photo Booth.
- [ ] Kamera berhasil diakses & live preview tampil.
- [ ] Foto berhasil diambil dengan bingkai/overlay ulang tahun otomatis menempel.
- [ ] Foto bisa diunduh/disimpan ke device dengan nama file yang jelas.
- [ ] Tampilan nyaman digunakan di layar mobile (uji di lebar ±375px–430px).
- [ ] Ada penanganan error yang ramah jika izin kamera ditolak.

## Future Improvement (Opsional, Tidak Wajib di Versi Awal)
- Galeri bersama semua foto tamu (butuh backend/storage).
- Pilihan beberapa varian bingkai/filter foto.
- Guestbook/ucapan dari tamu lain.
- Deploy otomatis ke hosting statis (Netlify/Vercel/GitHub Pages).
