# Struktur Halaman & Fitur

## Peta Navigasi
```
Landing / Dashboard (Halaman Utama)
   └── Menu: Photo Booth (halaman/section terpisah)
        └── Aksi: Ambil Foto → Preview → Simpan/Unduh
```

Dua opsi struktur (pilih salah satu saat eksekusi, default: Opsi A):
- **Opsi A (disarankan, simpel):** Single Page Application dengan 2 "view" yang berpindah tanpa reload (Dashboard & Photo Booth), berbagi 1 background music yang tetap jalan.
- **Opsi B:** 2 halaman terpisah (`index.html` / `dashboard` dan `photobooth`), musik direstart tiap pindah halaman (kurang ideal, hindari kalau bisa).

## 1. Halaman Dashboard (Landing)
**Tujuan:** Momen pertama dibuka = terasa seperti kejutan ulang tahun.

Komponen:
- Header/hero: ucapan "Happy Birthday, {{NAMA}}! 🎉" + angka besar **"17"**.
- Sub-teks ucapan personal (2–4 kalimat, bisa diedit user).
- Kontrol lagu: tombol Play/Pause musik latar (autoplay browser sering diblokir, jadi sediakan tombol "Putar Lagu 🎵" yang jelas kalau autoplay gagal).
- Animasi ringan: confetti / balon melayang saat halaman dibuka.
- Tombol CTA besar: **"Ambil Foto Kenangan 📸"** → menuju Photo Booth.

Perilaku:
- Musik tetap bisa lanjut diputar walau user pindah ke menu Photo Booth (kecuali Opsi B).
- Jika autoplay diblokir browser, tampilkan tombol play mengambang agar user bisa mulai musik secara manual.

## 2. Menu Photo Booth
**Tujuan:** User bisa ambil foto dengan nuansa "photo booth" ulang tahun, lalu simpan.

Komponen:
- Akses kamera device (via browser, minta izin kamera).
- Preview kamera real-time (mirror mode untuk kamera depan).
- Overlay/frame bertema ulang tahun hijau (contoh: border hijau + tulisan "Happy 17th Birthday" + tanggal, confetti graphic) yang otomatis menempel di hasil foto.
- Tombol shutter besar di tengah bawah (gaya tombol kamera bulat).
- Opsi hitung mundur sebelum jepret (misal 3 detik) — opsional tapi disarankan untuk kesan "photo booth" asli.
- Setelah foto diambil → tampil preview hasil foto.
- Tombol aksi di preview:
  - **Simpan/Unduh Foto** (download ke device / gallery).
  - **Ambil Ulang** (retake).
  - (Opsional) **Bagikan** via Web Share API jika didukung browser.

## Alur Simpan Foto
1. Kamera capture → gambar diambil dari video stream ke `<canvas>`.
2. Frame/overlay hijau digambar di atas hasil capture (canvas composite).
3. Canvas diekspor jadi file gambar (PNG/JPEG).
4. User klik "Simpan" → file diunduh ke device (nama file contoh: `ulang-tahun-17-{{timestamp}}.png`).

## Skenario Edge Case yang Perlu Ditangani
- User menolak izin kamera → tampilkan pesan ramah + instruksi cara mengaktifkan izin di browser.
- Device tanpa kamera / browser tidak support → tampilkan pesan fallback (misal: opsi upload foto dari galeri sebagai pengganti).
- Ukuran foto besar → kompres sebelum diunduh agar ringan.
