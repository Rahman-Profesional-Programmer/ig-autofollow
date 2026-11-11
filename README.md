# Instagram Auto Follow

Dokumentasi tersedia dalam bahasa Indonesia dan English.

## Bahasa Indonesia

Ekstensi Chrome Manifest V3 untuk menjalankan aksi follow pada tombol **Follow** atau **Ikuti** yang terlihat di tab Instagram aktif. Popup menyediakan pilihan bahasa Indonesia/Inggris, pengaturan jeda, status proses, dan tombol berhenti.

### Fitur

- Target aksi follow per proses: 1–200 (nilai awal 50).
- Jeda acak antaraksi, dapat diatur dalam detik.
- Istirahat setelah sejumlah aksi tertentu.
- Jeda tambahan ketika terdeteksi peringatan Instagram.
- Status proses, jumlah aksi, hitung mundur, dan durasi berjalan.
- Pilihan bahasa Indonesia dan Inggris.
- Dialog informasi batas follow.

### Pemasangan

1. Buka `chrome://extensions` di Chrome.
2. Aktifkan **Developer mode / Mode developer**.
3. Pilih **Load unpacked / Muat yang belum dipaketkan**.
4. Pilih folder proyek ini.
5. Buka Instagram dan masuk ke halaman yang berisi tombol follow. Klik ikon ekstensi untuk membuka popup.

### Cara menggunakan

1. Pilih bahasa **ID** atau **EN**.
2. Atur target, rentang jeda minimum/maksimum, frekuensi istirahat, dan durasi istirahat.
3. Tekan **Mulai**. Ekstensi mencari tombol yang terlihat dengan label persis **Follow** atau **Ikuti** pada halaman tab Instagram aktif.
4. Tekan **Stop** untuk menghentikan proses.

Target maksimal 200 adalah batas per proses yang ditetapkan antarmuka, bukan rekomendasi atau jaminan aman. Penghitung menunjukkan jumlah klik yang dilakukan, bukan konfirmasi bahwa Instagram berhasil memproses setiap follow. Pastikan tab Instagram tetap terbuka. Proses mungkin berhenti atau statusnya tidak tersedia jika halaman dimuat ulang atau tab ditutup.

### Izin

- `activeTab`: berinteraksi dengan tab aktif setelah pengguna menjalankan popup.
- `scripting`: menjalankan fungsi follow dan membaca status pada tab Instagram aktif.

### Catatan penting

Angka batas akun yang ditampilkan di popup adalah perkiraan, bukan batas resmi atau jaminan keamanan. Batas Instagram dapat berubah. Penggunaan otomasi dapat dibatasi oleh Instagram dan berisiko memicu pembatasan akun. Patuhi ketentuan Instagram, gunakan dengan tanggung jawab, dan hentikan proses segera jika muncul peringatan.

## English

A Chrome Manifest V3 extension that performs follow actions on visible **Follow** or **Ikuti** buttons in the active Instagram tab. The popup provides Indonesian/English language selection, delay settings, process status, and a stop button.

### Features

- Follow-action target per run: 1–200 (default: 50).
- Configurable random delay between actions, in seconds.
- A rest period after a configurable number of actions.
- An additional pause when an Instagram warning is detected.
- Process status, action count, countdown, and elapsed time.
- Indonesian and English interface.
- Follow-limit information dialog.

### Installation

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this project folder.
5. Open Instagram and navigate to a page containing follow buttons. Click the extension icon to open the popup.

### Usage

1. Select **ID** or **EN**.
2. Set the target, minimum/maximum delay range, rest frequency, and rest duration.
3. Click **Start**. The extension searches the visible page in the active Instagram tab for buttons with the exact label **Follow** or **Ikuti**.
4. Click **Stop** to stop the process.

The maximum target of 200 is a per-run interface limit, not a recommendation or safety guarantee. The counter reports clicks, not confirmation that Instagram successfully processed each follow. Keep the Instagram tab open. The process may stop or its status may become unavailable if the page is reloaded or the tab is closed.

### Permissions

- `activeTab`: interacts with the active tab after the user invokes the popup.
- `scripting`: runs the follow function and reads its status in the active Instagram tab.

### Important note

The account-limit figures shown in the popup are estimates, not official limits or a safety guarantee. Instagram limits can change. Automation may be restricted by Instagram and may put an account at risk of restrictions. Follow Instagram's terms, use responsibly, and stop immediately if a warning appears.
