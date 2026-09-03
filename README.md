# 🎉 Happy 17th Birthday Website — Panduan Penggunaan

## Cara Membuka Website
1. Buka file `index.html` di browser (Chrome / Safari / Edge terbaru)
2. Atau gunakan live server agar semua fitur berjalan optimal

> **Catatan:** Fitur kamera & audio membutuhkan HTTPS atau localhost untuk berfungsi penuh di browser modern.

---

## Cara Kustomisasi

### 1. Ganti Nama
Buka `script.js`, cari bagian `CONFIG` di atas:
```javascript
const CONFIG = {
  name: 'Youci',   // ← GANTI NAMA DI SINI
  ...
}
```
Dan di `index.html`, cari `<!-- GANTI NAMA DI BAWAH INI -->` lalu ubah teks "Youci" sesuai nama.

### 2. Ganti Ucapan
Buka `index.html`, cari komentar:
```html
<!-- GANTI TEKS UCAPAN DI BAWAH INI -->
```
Ubah isi paragraf `<p>...</p>` sesuai ucapan yang kamu inginkan.

### 3. Ganti / Tambahkan Musik
1. Salin file musik (MP3) ke folder `/assets/music/`
2. Namakan file `lagu-ultah.mp3` — atau
3. Buka `script.js` → ubah `CONFIG.musicSrc` ke path file kamu:
   ```javascript
   musicSrc: 'assets/music/nama-file-kamu.mp3',
   musicTitle: 'Judul Lagu Kamu 🎶',
   ```

### 4. Ganti Tanda Tangan Pengirim
Di `index.html`, cari:
```html
<!-- GANTI TANDA TANGAN / PENGIRIM DI BAWAH INI -->
<span class="message-sign">— </span>
```

---

## Fitur yang Tersedia
| Fitur | Status |
|---|---|
| Dashboard ucapan ulang tahun | ✅ |
| Angka "17" animasi besar | ✅ |
| Confetti otomatis | ✅ |
| Musik latar (play/pause) | ✅ |
| Photo Booth dengan kamera | ✅ |
| Hitung mundur 3-2-1 | ✅ |
| Efek flash saat jepret | ✅ |
| Bingkai / frame ulang tahun | ✅ |
| Simpan / unduh foto | ✅ |
| Bagikan foto (Web Share API) | ✅ |
| Fallback galeri jika kamera ditolak | ✅ |
| Flip kamera depan/belakang | ✅ |
| Mobile-first responsive | ✅ |

---

## Struktur File
```
/HBDchenyouci/
├── index.html          ← Halaman utama (dashboard + photobooth)
├── style.css           ← Semua styling
├── script.js           ← Semua logika JavaScript
├── assets/
│   ├── music/
│   │   └── lagu-ultah.mp3   ← TAMBAHKAN FILE MUSIK DI SINI
│   └── images/              ← (opsional) gambar tambahan
└── README.md           ← Panduan ini
```

---

## Tips Deploy ke Hosting Gratis
- **Netlify**: Drag & drop folder ini ke [netlify.com](https://netlify.com)
- **Vercel**: Upload via dashboard [vercel.com](https://vercel.com)
- **GitHub Pages**: Push ke repo GitHub, aktifkan Pages di Settings

> Hosting diperlukan agar fitur kamera & musik bekerja penuh (membutuhkan HTTPS).
