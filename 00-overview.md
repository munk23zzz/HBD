# Overview Project — Website Ucapan Ulang Tahun ke-17

## Ringkasan
Website mobile-first untuk merayakan ulang tahun ke-17, berisi:
1. **Dashboard Ucapan** — menampilkan ucapan selamat ulang tahun + lagu (musik latar/background music).
2. **Photo Booth** — halaman untuk mengambil foto (seperti photo booth), dengan frame/filter bertema, dan foto bisa disimpan/diunduh.

Tema warna utama: **hijau** (nuansa segar, ceria, cocok untuk perayaan).

## Target Perangkat
- **Mobile-first** (utama), tetap responsif di tablet/desktop.
- Dibuka lewat browser (tidak perlu instal aplikasi).

## Struktur Dokumen
| File | Isi |
|---|---|
| `00-overview.md` | Ringkasan project ini |
| `01-konsep-desain.md` | Aturan visual: warna, tipografi, layout, mood |
| `02-struktur-fitur.md` | Struktur halaman & alur navigasi (dashboard, menu) |
| `03-spesifikasi-photobooth.md` | Detail fitur photo booth: kamera, filter, simpan foto |
| `04-panduan-teknis-eksekusi.md` | Panduan teknis untuk AI agent saat membangun (stack, komponen, aturan kode) |

## Cara Pakai Dokumen Ini
Berikan seluruh isi folder ini ke AI agent (Anti Gravity) sebagai *context/spec*. Agent disarankan membaca `04-panduan-teknis-eksekusi.md` terakhir sebagai instruksi eksekusi, setelah memahami konsep di file 01–03.

## Catatan Konten yang Perlu Diisi User
Sebelum eksekusi, siapkan/isi:
- Nama yang berulang tahun
- Teks ucapan (atau biarkan AI membuat draft, lalu diedit)
- File lagu (MP3) yang ingin diputar, atau tautannya
- Foto/logo tambahan (opsional, misal foto profil)
