# Spesifikasi Fitur Photo Booth (Detail)

## Tujuan Fitur
Meniru pengalaman "photo booth" fisik di acara ulang tahun — sederhana, cepat, dan hasilnya langsung bisa disimpan sebagai kenangan, lengkap dengan bingkai bertema.

## Teknologi yang Digunakan (Web API)
- **`getUserMedia`** — untuk mengakses kamera device (depan/belakang).
- **`<video>`** — menampilkan live preview kamera.
- **`<canvas>`** — untuk "menjepret" frame video + menggambar overlay/frame di atasnya.
- **`canvas.toDataURL()` / `toBlob()`** — mengekspor hasil jadi gambar.
- **Elemen `<a download>` atau File System Access API** — untuk memicu proses unduh/simpan.
- (Opsional) **Web Share API** (`navigator.share`) — untuk tombol "Bagikan" ke media sosial/WA.

## Desain Bingkai/Overlay Foto
Bingkai ditempel otomatis di atas hasil jepretan, elemen yang disarankan:
- Border tebal warna hijau (sesuai palet di `01-konsep-desain.md`).
- Teks kecil di bagian bawah foto: `"Happy 17th Birthday, {{NAMA}}"` + tanggal acara.
- Aksen confetti/bintang kuning emas di sudut foto.
- Logo/angka "17" kecil di salah satu pojok.

> Catatan teknis: overlay digambar via `canvas.drawImage()` untuk elemen PNG transparan, atau `canvas.fillText()`/`strokeRect()` untuk teks & border, sehingga hasil akhir adalah satu file gambar gabungan (foto + bingkai).

## Alur Interaksi (Step by Step)
1. User masuk ke menu Photo Booth → browser minta izin akses kamera.
2. Jika izin diberikan → live preview kamera tampil penuh di layar (mode mirror untuk kamera depan).
3. User tekan tombol shutter (bulat, besar, warna hijau/kuning aksen).
4. (Opsional) Hitung mundur 3-2-1 muncul di atas preview sebelum capture.
5. Sistem mengambil 1 frame dari video → digambar ke canvas.
6. Overlay/bingkai ulang tahun digambar di atas frame tersebut di canvas.
7. Hasil akhir ditampilkan sebagai preview (bukan lagi video, tapi gambar statis).
8. User pilih:
   - **Simpan** → gambar diunduh ke device.
   - **Ulangi** → kembali ke live preview kamera.

## Aturan UX Penting
- Tombol shutter harus jadi elemen paling mencolok di layar (ukuran besar, posisi mudah dijangkau ibu jari di mobile).
- Beri feedback visual saat foto diambil (misal efek kilat/flash putih sekilas, atau animasi shutter click) supaya terasa seperti kamera sungguhan.
- Preview hasil foto harus full-screen atau cukup besar agar user bisa menilai hasil sebelum menyimpan.
- Nama file unduhan otomatis dan deskriptif, contoh: `happy-birthday-17-YYYYMMDD-HHMM.png`.

## Privasi & Teknis Tambahan
- Foto **tidak perlu diunggah ke server** — seluruh proses (ambil, olah, simpan) terjadi di sisi browser (client-side) demi privasi dan kesederhanaan hosting.
- Jika nanti ingin fitur galeri bersama (semua tamu bisa lihat foto satu sama lain), itu butuh backend/storage tambahan — di luar cakupan versi awal ini, catat sebagai *future improvement*.
