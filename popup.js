document.getElementById('startBtn').addEventListener('click', async () => {
  const target = parseInt(document.getElementById('targetFollow').value) || 50;
  const minDelay = parseInt(document.getElementById('minDelay').value) || 5;
  const maxDelay = parseInt(document.getElementById('maxDelay').value) || 10;

  const statusDiv = document.getElementById('status');
  statusDiv.innerText = "Status: Menjalankan...";

  // Dapatkan tab aktif yang sedang dibuka user (pastikan di halaman instagram)
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url.includes("instagram.com")) {
    statusDiv.innerText = "Error: Buka halaman Instagram dulu!";
    return;
  }

  // Kirim parameter ke script yang disuntikkan ke halaman aktif
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: runAutoFollow,
    args: [target, minDelay, maxDelay]
  });
});

const limitsDialog = document.getElementById('limitsDialog');
document.getElementById('limitsBtn').addEventListener('click', () => {
  limitsDialog.showModal();
});
document.getElementById('closeLimitsBtn').addEventListener('click', () => {
  limitsDialog.close();
});

// Fungsi utama yang akan disuntikkan ke halaman Instagram
function runAutoFollow(targetCount, minD, maxD) {
  if (window.isFollowingActive) {
    alert("Script Auto Follow sudah berjalan!");
    return;
  }
  window.isFollowingActive = true;

  const getRandomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) * 1000;
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  (async function() {
    let followedCount = 0;
    console.log("=== Auto Follow Dimulai ===");

    while (window.isFollowingActive && followedCount < targetCount) {
      // Cari tombol yang teksnya persis "Follow" atau "Ikuti"
      const buttons = Array.from(document.querySelectorAll('button')).filter(btn => {
        const text = btn.innerText.trim();
        return text === 'Follow' || text === 'Ikuti';
      });

      if (buttons.length === 0) {
        console.log("Tombol 'Follow' habis di layar, melakukan scroll ke bawah...");
        
        // Cari kontainer modal scrollable Instagram (atau fallback ke window utama)
        const scrollableContainer = document.querySelector('div.x9f619.x1n2onr6.x1ja2u2z');
        if (scrollableContainer) {
          scrollableContainer.scrollBy(0, 300);
        } else {
          window.scrollBy(0, 300);
        }

        await delay(3000);
        continue;
      }

      const targetButton = buttons[0];

      try {
        targetButton.click();
        followedCount++;
        console.log(`Berhasil Follow ke-${followedCount} dari target ${targetCount}`);

        // Tentukan jeda acak untuk siklus berikutnya
        const currentDelay = getRandomDelay(minD, maxD);
        console.log(`Menunggu ${currentDelay / 1000} detik...`);
        await delay(currentDelay);

      } catch (error) {
        console.error("Gagal melakukan klik, mencoba scroll ke bawah...", error);
        
        // Handle jika gagal klik: scroll sedikit ke bawah
        const scrollableContainer = document.querySelector('div.x9f619.x1n2onr6.x1ja2u2z');
        if (scrollableContainer) {
          scrollableContainer.scrollBy(0, 250);
        } else {
          window.scrollBy(0, 250);
        }
        await delay(3000);
      }
    }

    window.isFollowingActive = false;
    console.log("=== Selesai / Target Tercapai ===");
    alert("Proses Auto Follow Selesai!");
  })();
}