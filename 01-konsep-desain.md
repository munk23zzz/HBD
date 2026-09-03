# Konsep Desain Visual

## Mood & Gaya
Ceria, hangat, "party vibe" tapi tetap clean — bukan jenis desain corporate/kaku. Cocok dibagikan di WhatsApp/Instagram Story sebagai kejutan ulang tahun.

## Palet Warna (Tema Hijau)
Gunakan skema hijau bertingkat supaya tidak monoton dan tetap enak dibaca:

| Peran | Warna | Contoh Hex |
|---|---|---|
| Primary (utama) | Hijau daun / emerald | `#1E8A5D` atau `#2E7D32` |
| Primary Dark | Hijau tua untuk kontras teks/tombol | `#14532D` |
| Accent | Hijau muda / mint segar | `#7FD99A` |
| Highlight/Aksen kedua | Kuning keemasan (untuk elemen pesta, confetti, angka "17") | `#F4C542` |
| Background | Hijau sangat muda / off-white kehijauan | `#F3FAF3` |
| Teks utama | Hijau gelap / hitam kehijauan | `#0F2E1D` |

> Aturan: hijau adalah warna dominan (≥60% area), kuning emas hanya untuk aksen kecil (angka, bintang, confetti, tombol CTA sesekali).

## Tipografi
- **Judul/angka "17"**: font tebal, sedikit playful (contoh: Poppins Bold, Baloo 2, atau Fredoka).
- **Body text/ucapan**: font mudah dibaca (contoh: Inter, Nunito, Poppins Regular).
- Ukuran font besar di mobile (judul ±28–36px, body ±16px) agar mudah dibaca di layar kecil.

## Elemen Visual Pendukung
- Confetti / balon animasi ringan (CSS animation, bukan file berat).
- Ikon angka **"17"** sebagai elemen dekoratif besar di dashboard.
- Bentuk organik (blob/lengkungan) sebagai background, bukan kotak kaku, untuk kesan playful.
- Ikon kamera bulat/rounded untuk tombol menuju Photo Booth.

## Layout & Spacing
- Mobile-first: lebar konten menyesuaikan layar (max-width sekitar 480px, di-center untuk tampilan di desktop).
- Padding aman di tepi layar (16–24px) agar tidak mepet.
- Tombol besar dan mudah disentuh (minimal tinggi 44px) — prioritas UX mobile/touch.
- Navigasi antar menu (Dashboard ↔ Photo Booth) simpel: bisa berupa 2 tab/menu di bawah (bottom navigation) atau tombol besar di dashboard.

## Nada Bahasa (Copywriting)
- Hangat, personal, gembira. Boleh pakai emoji secukupnya (🎉🎂💚).
- Sapaan bisa disesuaikan nama yang berulang tahun (placeholder `{{NAMA}}`).

## Yang Dihindari
- Warna hijau terlalu gelap/suram (kesan bukan warna ulang tahun).
- Layout padat/berdesakan.
- Font terlalu formal/kaku (hindari kesan dokumen resmi).
