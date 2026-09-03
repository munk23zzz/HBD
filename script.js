/**
 * ============================================================
 * BIRTHDAY WEBSITE - SCRIPT.JS (v2 — Photo Strip Mode)
 * Happy 17th Birthday!
 *
 * Fitur:
 * - SPA navigation (Dashboard <-> Photo Booth)
 * - Background music player dengan autoplay fallback
 * - Confetti animation
 * - Photo Strip: ambil 3 foto → tempel ke template PNG → unduh
 * - Pilihan 2 template: 1.png (hijau) & 2.png (kuning retro)
 * ============================================================
 */

'use strict';

/* ============================================================
   KONFIGURASI
   ============================================================ */
const CONFIG = {
  name:             'Erina',
  musicSrc:         'assets/music/lagu-ultah.mp3',
  musicTitle:       'Lagu Spesial Untukmu 🎶',
  countdownEnabled: true,
  countdownSeconds: 3,
  facingMode:       'user',
  totalPhotos:      3,   // jumlah foto per strip
};

/* ============================================================
   TEMPLATE DEFINITIONS
   Koordinat slot foto (x, y, w, h) dalam piksel relatif
   terhadap ukuran asli template PNG (600 × 1800 px).
   ============================================================ */
const TEMPLATES = [
  {
    id:    1,
    src:   'Template.png',
    label: 'Template',
    // Template.png: 600 × 1800 px — dikalibrasi oleh user
    slots: [
      { x: 145, y:   56, w: 333, h: 319, r: 3 },                  // Foto 1
      { x: 169, y:  582, w: 342, h: 328, r: 3, rotate: 10 },        // Foto 2
      { x:  97, y: 1037, w: 363, h: 351, r: 3, rotate: -12 },       // Foto 3
    ],
  },
];








/* ============================================================
   STATE
   ============================================================ */
const state = {
  currentView:       'dashboard',
  isPlaying:         false,
  mediaStream:       null,
  facingMode:        CONFIG.facingMode,
  countdownEnabled:  CONFIG.countdownEnabled,
  isShooting:        false,
  // Strip mode
  currentTemplate:   TEMPLATES[0],
  photos:            [],          // array of ImageBitmap / ImageData
  photoCount:        0,           // berapa foto sudah diambil
  stripBlob:         null,        // hasil akhir strip
};

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const dom = {
  dashboard:         document.getElementById('dashboard'),
  photobooth:        document.getElementById('photobooth'),
  photoPreview:      document.getElementById('photo-preview-state'),
  cameraState:       document.getElementById('camera-state'),
  confettiContainer: document.getElementById('confetti-container'),
  bgMusic:           document.getElementById('bg-music'),
  musicFab:          document.getElementById('music-fab'),
  goPhotoboothBtn:   document.getElementById('go-photobooth-btn'),
  videoPreview:      document.getElementById('video-preview'),
  cameraLoading:     document.getElementById('camera-loading'),
  cameraContainer:   document.getElementById('camera-container'),
  cameraError:       document.getElementById('camera-error'),
  cameraErrorMsg:    document.getElementById('camera-error-msg'),
  cameraControls:    document.getElementById('camera-controls'),
  countdownOverlay:  document.getElementById('countdown-overlay'),
  countdownNumber:   document.getElementById('countdown-number'),
  flashOverlay:      document.getElementById('flash-overlay'),
  shutterBtn:        document.getElementById('shutter-btn'),
  flipCameraBtn:     document.getElementById('flip-camera-btn'),
  timerBtn:          document.getElementById('timer-btn'),
  pbBackBtn:         document.getElementById('pb-back-btn'),
  galleryUpload:     document.getElementById('gallery-upload'),
  resultCanvas:      document.getElementById('result-canvas'),
  captureCanvas:     document.getElementById('capture-canvas'),
  downloadBtn:       document.getElementById('download-btn'),
  shareBtn:          document.getElementById('share-btn'),
  retakeBtn:         document.getElementById('retake-btn'),
  retakeBtn2:        document.getElementById('retake-btn-2'),
  backToDashBtn:     document.getElementById('back-to-dash-btn'),
  toast:             document.getElementById('toast'),
  // Strip-specific
  photoCounter:      document.getElementById('photo-counter'),
  photoThumbs:       document.getElementById('photo-thumbs'),
  templatePicker:    document.getElementById('template-picker'),
};

/* ============================================================
   UTILITIES
   ============================================================ */
function showToast(msg, duration = 2800) {
  dom.toast.textContent = msg;
  dom.toast.classList.add('show');
  setTimeout(() => dom.toast.classList.remove('show'), duration);
}

function formatDateID(date) {
  const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getTimestamp() {
  const d   = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ============================================================
   CONFETTI
   ============================================================ */
const CONFETTI_COLORS = ['#1E8A5D','#7FD99A','#F4C542','#b2f0c5','#FFD700','#ffffff','#14532D','#2dab75'];

function launchConfetti(count = 80, duration = 4000) {
  dom.confettiContainer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const el    = document.createElement('div');
    el.className = 'confetti-piece';
    const size  = 6 + Math.random() * 10;
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    el.style.cssText = `left:${Math.random()*100}%;width:${size}px;height:${size}px;background:${color};border-radius:${Math.random()>.5?'50%':'2px'};animation-duration:${3+Math.random()*4}s;animation-delay:${Math.random()*2}s;`;
    dom.confettiContainer.appendChild(el);
  }
  setTimeout(() => dom.confettiContainer.innerHTML = '', duration + 2000);
}

/* ============================================================
   MUSIC — autoplay otomatis, FAB untuk toggle
   ============================================================ */
function updateMusicUI(playing) {
  state.isPlaying        = playing;
  dom.musicFab.textContent = playing ? '🎵' : '🔇';
  dom.musicFab.title       = playing ? 'Pause musik' : 'Putar musik';
  dom.musicFab.setAttribute('aria-label', playing ? 'Pause musik' : 'Putar musik');
}

async function toggleMusic() {
  try {
    if (state.isPlaying) {
      dom.bgMusic.pause();
      updateMusicUI(false);
    } else {
      await dom.bgMusic.play();
      updateMusicUI(true);
    }
  } catch {
    showToast('🎵 Ketuk layar untuk memulai musik');
  }
}

function initMusic() {
  dom.bgMusic.src    = CONFIG.musicSrc;
  dom.bgMusic.volume = 0.85;

  // Coba autoplay langsung
  dom.bgMusic.play()
    .then(() => updateMusicUI(true))
    .catch(() => {
      // Autoplay diblokir browser — tunggu interaksi pertama user
      updateMusicUI(false);
      const startOnInteraction = async () => {
        try {
          await dom.bgMusic.play();
          updateMusicUI(true);
          // Hapus listener setelah berhasil
          document.removeEventListener('touchstart', startOnInteraction);
          document.removeEventListener('click',      startOnInteraction);
        } catch { /* ignore */ }
      };
      document.addEventListener('touchstart', startOnInteraction, { once: true });
      document.addEventListener('click',      startOnInteraction, { once: true });
    });
}

/* ============================================================
   VIEW NAVIGATION
   ============================================================ */
function showView(viewName) {
  dom.dashboard.classList.remove('active');
  dom.photobooth.classList.remove('active');
  dom.photoPreview.classList.remove('show');
  state.currentView = viewName;

  if (viewName === 'dashboard') {
    dom.dashboard.classList.add('active');
    stopCamera();
  } else if (viewName === 'photobooth') {
    dom.photobooth.classList.add('active');
    dom.photoPreview.classList.remove('show');
    resetStrip();
    initCamera();
  } else if (viewName === 'preview') {
    dom.photobooth.classList.add('active');
    dom.photoPreview.classList.add('show');
  }
  window.scrollTo(0, 0);
}

/* ============================================================
   CAMERA
   ============================================================ */
async function initCamera() {
  dom.cameraLoading.style.display = 'flex';
  dom.cameraError.classList.remove('show');
  dom.videoPreview.style.display  = 'block';
  dom.cameraControls.style.display = 'flex';

  if (!navigator.mediaDevices?.getUserMedia) {
    showCameraError('Browser kamu tidak mendukung akses kamera. Coba Chrome atau Safari terbaru.');
    return;
  }
  try {
    if (state.mediaStream) state.mediaStream.getTracks().forEach(t => t.stop());
    state.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: state.facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    dom.videoPreview.srcObject = state.mediaStream;
    await dom.videoPreview.play();
    dom.cameraLoading.style.display = 'none';
  } catch (err) {
    let msg = 'Terjadi kesalahan saat mengakses kamera.';
    if (err.name === 'NotAllowedError')   msg = 'Izin kamera ditolak. Aktifkan di pengaturan browser, lalu refresh.';
    if (err.name === 'NotFoundError')     msg = 'Tidak ada kamera terdeteksi di perangkat kamu.';
    if (err.name === 'NotReadableError')  msg = 'Kamera sedang dipakai aplikasi lain.';
    if (err.name === 'OverconstrainedError') {
      try {
        state.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        dom.videoPreview.srcObject = state.mediaStream;
        await dom.videoPreview.play();
        dom.cameraLoading.style.display = 'none';
        return;
      } catch {}
    }
    showCameraError(msg);
  }
}

function showCameraError(msg) {
  dom.cameraLoading.style.display  = 'none';
  dom.videoPreview.style.display   = 'none';
  dom.cameraControls.style.display = 'none';
  dom.cameraErrorMsg.textContent   = msg;
  dom.cameraError.classList.add('show');
}

function stopCamera() {
  state.mediaStream?.getTracks().forEach(t => t.stop());
  state.mediaStream      = null;
  dom.videoPreview.srcObject = null;
}

async function flipCamera() {
  state.facingMode = state.facingMode === 'user' ? 'environment' : 'user';
  dom.videoPreview.style.transform = state.facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)';
  showToast(state.facingMode === 'user' ? '📷 Kamera depan' : '📷 Kamera belakang');
  await initCamera();
}

/* ============================================================
   COUNTDOWN & FLASH
   ============================================================ */
async function runCountdown(seconds) {
  dom.countdownOverlay.style.display = 'flex';
  for (let i = seconds; i >= 1; i--) {
    dom.countdownNumber.textContent = i;
    dom.countdownNumber.style.animation = 'none';
    void dom.countdownNumber.offsetWidth;
    dom.countdownNumber.style.animation = 'countdownPop 1s ease-out';
    await sleep(1000);
  }
  dom.countdownOverlay.style.display = 'none';
}

async function flashEffect() {
  dom.flashOverlay.style.opacity = '1';
  await sleep(80);
  dom.flashOverlay.style.opacity = '0';
}

/* ============================================================
   STRIP PHOTO LOGIC
   ============================================================ */

/** Reset strip state (when entering photo booth) */
function resetStrip() {
  state.photos     = [];
  state.photoCount = 0;
  state.stripBlob  = null;
  updatePhotoCounter();
  renderThumbs();
}

/** Update the "Foto X/3" counter UI */
function updatePhotoCounter() {
  if (!dom.photoCounter) return;
  dom.photoCounter.textContent = `Foto ${state.photoCount} / ${CONFIG.totalPhotos}`;

  if (dom.shutterBtn) {
    const done = state.photoCount >= CONFIG.totalPhotos;
    if (done) {
      // Ubah shutter jadi tombol "Buat Strip"
      dom.shutterBtn.disabled        = false;
      dom.shutterBtn.style.opacity   = '1';
      dom.shutterBtn.style.background = 'var(--gold)';
      dom.shutterBtn.innerHTML       = '✨';
      dom.shutterBtn.title           = 'Buat Photo Strip';
      dom.shutterBtn.setAttribute('aria-label', 'Buat Photo Strip');
      dom.shutterBtn.onclick         = () => buildAndShowStrip();
    } else {
      dom.shutterBtn.style.background = '';
      dom.shutterBtn.innerHTML       = '';
      dom.shutterBtn.title           = 'Ambil Foto';
      dom.shutterBtn.setAttribute('aria-label', 'Ambil Foto');
      dom.shutterBtn.onclick         = null;
    }
  }
}


/** Render thumbnail strip preview */
function renderThumbs() {
  if (!dom.photoThumbs) return;
  dom.photoThumbs.innerHTML = '';
  for (let i = 0; i < CONFIG.totalPhotos; i++) {
    const wrap = document.createElement('div');
    wrap.className = 'thumb-slot' + (i < state.photoCount ? ' filled' : '');
    if (i < state.photos.length) {
      const img = document.createElement('img');
      img.src = state.photos[i].dataUrl;
      img.alt = `Foto ${i+1}`;
      wrap.appendChild(img);
    } else {
      wrap.innerHTML = `<span>${i+1}</span>`;
    }
    // Allow re-take: click filled thumb to retake that slot
    if (i < state.photos.length) {
      wrap.title = 'Klik untuk ambil ulang foto ini';
      wrap.style.cursor = 'pointer';
      wrap.addEventListener('click', () => retakeSlot(i));
    }
    dom.photoThumbs.appendChild(wrap);
  }
}

/** Retake a specific slot */
function retakeSlot(index) {
  state.photos.splice(index);
  state.photoCount = index;
  updatePhotoCounter();
  renderThumbs();
  showToast(`📸 Ambil ulang foto ${index + 1}`);
}

/** Capture one photo from video into the strip */
async function captureOnePhoto() {
  if (state.isShooting || state.photoCount >= CONFIG.totalPhotos) return;
  state.isShooting = true;

  try {
    if (state.countdownEnabled) await runCountdown(CONFIG.countdownSeconds);
    await flashEffect();

    const video  = dom.videoPreview;
    const canvas = dom.captureCanvas;
    const ctx    = canvas.getContext('2d');
    const vw     = video.videoWidth  || 640;
    const vh     = video.videoHeight || 480;
    canvas.width  = vw;
    canvas.height = vh;

    if (state.facingMode === 'user') {
      ctx.save(); ctx.translate(vw, 0); ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, vw, vh);
      ctx.restore();
    } else {
      ctx.drawImage(video, 0, 0, vw, vh);
    }

    // Store as dataUrl thumbnail
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    state.photos.push({ dataUrl, width: vw, height: vh });
    state.photoCount++;
    updatePhotoCounter();
    renderThumbs();

    if (state.photoCount < CONFIG.totalPhotos) {
      showToast(`✅ Foto ${state.photoCount} diambil! Ambil lagi ${CONFIG.totalPhotos - state.photoCount} foto lagi.`);
    } else {
      showToast('🎉 Semua foto siap! Membuat strip...');
      await sleep(600);
      await buildAndShowStrip();
    }

  } catch (err) {
    console.error(err);
    showToast('❌ Gagal mengambil foto, coba lagi.');
  }

  state.isShooting = false;
}

/* ============================================================
   BUILD STRIP — compose photos onto template
   ============================================================ */
async function buildAndShowStrip() {
  const tpl = state.currentTemplate;

  // Load template image
  const templateImg = await loadImage(tpl.src);

  // Create canvas matching template size
  const canvas = dom.resultCanvas;
  canvas.width  = templateImg.naturalWidth;
  canvas.height = templateImg.naturalHeight;
  const ctx = canvas.getContext('2d');

  // Draw template first as base
  ctx.drawImage(templateImg, 0, 0);

  // For each slot, draw the corresponding photo clipped to the slot shape
  for (let i = 0; i < tpl.slots.length && i < state.photos.length; i++) {
    const slot      = tpl.slots[i];
    const radius    = slot.r ?? 12;
    const photoData = state.photos[i];
    const rotateDeg = slot.rotate ?? 0;

    // Load photo image
    const photoImg = await loadImage(photoData.dataUrl);

    ctx.save();

    // Apply rotation around slot center if needed
    if (rotateDeg !== 0) {
      const cx = slot.x + slot.w / 2;
      const cy = slot.y + slot.h / 2;
      ctx.translate(cx, cy);
      ctx.rotate((rotateDeg * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    // Clip to slot rectangle with rounded corners
    ctx.beginPath();
    roundRectPath(ctx, slot.x, slot.y, slot.w, slot.h, radius);
    ctx.closePath();
    ctx.clip();

    // Draw photo to fill slot (object-fit: cover)
    drawImageCover(ctx, photoImg, slot.x, slot.y, slot.w, slot.h);

    ctx.restore();
  }

  // Re-draw template on top to restore overlay decorations (flowers, badges, etc.)
  ctx.drawImage(templateImg, 0, 0);

  // Convert to blob
  canvas.toBlob(blob => { state.stripBlob = blob; }, 'image/jpeg', 0.92);

  // Show share button if available
  if (navigator.share) dom.shareBtn.style.display = 'flex';
  else                 dom.shareBtn.style.display = 'none';

  showView('preview');
}


/** Load image from src → HTMLImageElement (Promise) */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src     = src;
  });
}

/** Draw image with object-fit: cover behavior */
function drawImageCover(ctx, img, dx, dy, dw, dh) {
  const imgAspect  = img.naturalWidth / img.naturalHeight;
  const destAspect = dw / dh;

  let sx, sy, sw, sh;

  if (imgAspect > destAspect) {
    // Image is wider — crop sides
    sh = img.naturalHeight;
    sw = sh * destAspect;
    sx = (img.naturalWidth - sw) / 2;
    sy = 0;
  } else {
    // Image is taller — crop top/bottom
    sw = img.naturalWidth;
    sh = sw / destAspect;
    sx = 0;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

/** Rounded rect clipping path */
function roundRectPath(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

/* ============================================================
   GALLERY FALLBACK
   ============================================================ */
function handleGalleryUpload(file) {
  if (!file?.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    if (state.photoCount >= CONFIG.totalPhotos) return;
    state.photos.push({ dataUrl: e.target.result, width: 640, height: 480 });
    state.photoCount++;
    updatePhotoCounter();
    renderThumbs();
    showToast(`🖼️ Foto ${state.photoCount} dari galeri dimuat!`);
    if (state.photoCount >= CONFIG.totalPhotos) {
      await sleep(500);
      await buildAndShowStrip();
    }
  };
  reader.readAsDataURL(file);
}

/* ============================================================
   DOWNLOAD / SHARE
   ============================================================ */
function downloadStrip() {
  const filename = `happy-birthday-17-${CONFIG.name}-strip-${getTimestamp()}.jpg`;
  if (state.stripBlob) {
    const url = URL.createObjectURL(state.stripBlob);
    triggerDownload(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } else {
    triggerDownload(dom.resultCanvas.toDataURL('image/jpeg', 0.92), filename);
  }
  showToast('✅ Strip foto berhasil disimpan!');
}

function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.style.display = 'none';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

async function shareStrip() {
  if (!state.stripBlob) { showToast('⚠️ Strip foto belum siap.'); return; }
  const filename = `happy-birthday-17-${CONFIG.name}-strip-${getTimestamp()}.jpg`;
  const file     = new File([state.stripBlob], filename, { type: 'image/jpeg' });
  const shareData = {
    title: `Happy 17th Birthday, ${CONFIG.name}! 🎉`,
    text:  `Strip foto kenangan ulang tahun ke-17 ${CONFIG.name}! 💚🎂`,
    files: [file],
  };
  try {
    if (navigator.canShare?.(shareData)) await navigator.share(shareData);
    else await navigator.share({ title: shareData.title, text: shareData.text });
  } catch (err) {
    if (err.name !== 'AbortError') showToast('❌ Gagal membagikan foto.');
  }
}

/* ============================================================
   TEMPLATE PICKER
   ============================================================ */
function buildTemplatePicker() {
  if (!dom.templatePicker) return;
  dom.templatePicker.innerHTML = '';
  TEMPLATES.forEach((tpl, idx) => {
    const btn = document.createElement('button');
    btn.className = 'tpl-btn' + (idx === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Pilih template ${tpl.label}`);
    btn.innerHTML = `<img src="${tpl.src}" alt="Template ${tpl.id}" /><span>${tpl.label}</span>`;
    btn.addEventListener('click', () => {
      state.currentTemplate = tpl;
      dom.templatePicker.querySelectorAll('.tpl-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Template dipilih: ${tpl.label}`);
    });
    dom.templatePicker.appendChild(btn);
  });
}

/* ============================================================
   TIMER TOGGLE
   ============================================================ */
function toggleTimer() {
  state.countdownEnabled = !state.countdownEnabled;
  dom.timerBtn.style.opacity = state.countdownEnabled ? '1' : '0.45';
  showToast(state.countdownEnabled ? '⏱️ Hitung mundur aktif (3 detik)' : '⏱️ Hitung mundur nonaktif');
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
function initEventListeners() {
  dom.musicFab.addEventListener('click', toggleMusic);
  dom.goPhotoboothBtn.addEventListener('click', () => {
    launchConfetti(30, 2000);
    setTimeout(() => showView('photobooth'), 200);
  });
  dom.pbBackBtn.addEventListener('click', () => showView('dashboard'));
  dom.shutterBtn.addEventListener('click', captureOnePhoto);
  dom.flipCameraBtn.addEventListener('click', flipCamera);
  dom.timerBtn.addEventListener('click', toggleTimer);
  dom.retakeBtn.addEventListener('click',  () => showView('photobooth'));
  dom.retakeBtn2.addEventListener('click', () => showView('photobooth'));
  dom.backToDashBtn.addEventListener('click', () => showView('dashboard'));
  dom.downloadBtn.addEventListener('click', downloadStrip);
  dom.shareBtn.addEventListener('click', shareStrip);
  dom.galleryUpload?.addEventListener('change', e => handleGalleryUpload(e.target.files[0]));

  document.addEventListener('keydown', e => {
    if (state.currentView === 'photobooth' && e.code === 'Space') { e.preventDefault(); captureOnePhoto(); }
    if (e.code === 'KeyM') toggleMusic();
  });
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  initMusic();
  initEventListeners();
  buildTemplatePicker();
  launchConfetti(100, 5000);
  dom.timerBtn.style.opacity = state.countdownEnabled ? '1' : '0.45';
  if (!navigator.share) dom.shareBtn.style.display = 'none';
  console.log(`🎉 Happy 17th Birthday, ${CONFIG.name}! 💚`);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
