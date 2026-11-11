// Teks antarmuka disimpan terpisah agar mudah dialihkan antara bahasa Indonesia dan Inggris.
const translations = {
  id: {
    title: 'Auto Follow IG by Indah Amuntai',
    warningMain: 'Gunakan target yang wajar untuk akun Anda. Batas 200 aksi per proses bukan jaminan aman.',
    warningSub: 'Batas Instagram dapat berubah; hentikan aktivitas jika muncul peringatan.',
    targetTotal: 'Target total follow',
    accounts: 'akun',
    delayRange: 'Rentang jeda (detik)',
    batchEvery: 'Setiap',
    actionsLabel: 'aksi follow',
    restFor: 'Istirahat selama',
    failurePause: 'Jika Instagram menampilkan peringatan, jeda sebelum melanjutkan',
    minutes: 'menit',
    nextAction: 'Aksi berikutnya dalam',
    runningFor: 'Aplikasi berjalan selama',
    progress: '{done} / {target} aksi',
    statusPrefix: 'Status',
    ready: 'Siap',
    running: 'Berjalan',
    waiting: 'Menunggu',
    resting: 'Istirahat',
    failurePauseStatus: 'Jeda setelah peringatan/error',
    completed: 'Target tercapai',
    stopped: 'Dihentikan',
    noTargets: 'Tidak ada tombol follow yang ditemukan',
    error: 'Terjadi kesalahan',
    invalidSettings: 'Periksa target dan rentang pengaturan.',
    openInstagram: 'Buka Instagram untuk menjalankan follow.',
    starting: 'Memulai...',
    alreadyRunning: 'Proses follow sudah berjalan.',
    notExtension: 'Jalankan melalui popup ekstensi di Chrome.',
    statusUnavailable: 'Status tidak dapat dibaca. Buka kembali halaman Instagram.',
    failedStart: 'Tidak dapat memulai proses follow.',
    stopping: 'Menghentikan...',
    stopError: 'Tidak dapat menghentikan proses di tab ini.',
    start: 'Mulai',
    stop: 'Stop',
    limitsButton: 'Lihat informasi batas',
    limitsTitle: 'Informasi batas follow',
    limitNew: 'Akun baru (kurang dari 1 bulan): 20–50 akun per hari.',
    limitYoung: 'Akun berusia kurang dari 6 bulan: 50–100 akun per hari (maksimal 150).',
    limitEstablished: 'Akun mapan (di atas 6 bulan / aktif): 100–150 akun per hari (batas maksimum mutlak sekitar 200 akun per hari).',
    limitHourly: 'Batasan per jam: sekitar 5–10 kali per jam untuk akun baru, dan maksimal 15–20 kali per jam untuk akun lama.',
    limitLifetime: 'Batas total akun yang bisa diikuti: maksimal 7.500 akun seumur hidup akun tersebut.',
    limitsDisclaimer: 'Angka ini hanya perkiraan, bukan batas resmi atau jaminan aman. Batas Instagram dapat berubah; selalu patuhi kebijakan Instagram dan hentikan aktivitas jika muncul peringatan.',
    close: 'Tutup'
  },
  en: {
    title: 'Auto Follow IG by Indah Amuntai',
    warningMain: 'Use a reasonable target for your account. The 200-action per-run cap is not a safety guarantee.',
    warningSub: 'Instagram limits can change; stop if you see a warning.',
    targetTotal: 'Total follow target',
    accounts: 'accounts',
    delayRange: 'Delay range (seconds)',
    batchEvery: 'Rest after every',
    actionsLabel: 'follow actions',
    restFor: 'Rest duration',
    failurePause: 'If Instagram shows a warning, pause before continuing',
    minutes: 'minutes',
    nextAction: 'Next action in',
    runningFor: 'Application running for',
    progress: '{done} / {target} actions',
    statusPrefix: 'Status',
    ready: 'Ready',
    running: 'Running',
    waiting: 'Waiting',
    resting: 'Resting',
    failurePauseStatus: 'Paused after warning/error',
    completed: 'Target reached',
    stopped: 'Stopped',
    noTargets: 'No follow buttons found',
    error: 'An error occurred',
    invalidSettings: 'Check the target and delay settings.',
    openInstagram: 'Open Instagram to start following.',
    starting: 'Starting...',
    alreadyRunning: 'The follow process is already running.',
    notExtension: 'Open this panel from the Chrome extension popup.',
    statusUnavailable: 'Unable to read status. Reopen the Instagram tab.',
    failedStart: 'Could not start the follow process.',
    stopping: 'Stopping...',
    stopError: 'Could not stop the process in this tab.',
    start: 'Start',
    stop: 'Stop',
    limitsButton: 'View follow limit information',
    limitsTitle: 'Follow limit information',
    limitNew: 'New accounts (less than 1 month old): 20–50 accounts per day.',
    limitYoung: 'Accounts less than 6 months old: 50–100 accounts per day (up to 150).',
    limitEstablished: 'Established/active accounts (over 6 months): 100–150 accounts per day (absolute maximum around 200 per day).',
    limitHourly: 'Hourly estimates: around 5–10 per hour for new accounts, and up to 15–20 per hour for older accounts.',
    limitLifetime: 'Maximum total accounts followed: 7,500 over the account lifetime.',
    limitsDisclaimer: 'These figures are estimates, not official limits or a safety guarantee. Instagram limits can change; follow Instagram policies and stop if you see a warning.',
    close: 'Close'
  }
};

const statusElement = document.getElementById('status');
const startButton = document.getElementById('startBtn');
const stopButton = document.getElementById('stopBtn');
const limitsDialog = document.getElementById('limitsDialog');
let language = localStorage.getItem('igAutoFollowLanguage') === 'en' ? 'en' : 'id';
let runtimeState = null;
let manualStatusKey = 'ready';
let manualStatusUntil = 0;
let pollInProgress = false;
let lastPollErrorAt = 0;

function translate(key) {
  return translations[language][key] || translations.id[key] || key;
}

function setManualStatus(key) {
  manualStatusKey = key;
  manualStatusUntil = Date.now() + 5000;
  render();
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = translate(element.dataset.i18n);
  });
  document.getElementById('idLangBtn').setAttribute('aria-pressed', String(language === 'id'));
  document.getElementById('enLangBtn').setAttribute('aria-pressed', String(language === 'en'));
  render();
}

function formatClock(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return [hours, minutes, remainingSeconds].map(value => String(value).padStart(2, '0')).join(':');
}

function formatCountdown(timestamp) {
  if (!timestamp) {
    return '--:--';
  }
  const remainingSeconds = Math.max(0, Math.ceil((timestamp - Date.now()) / 1000));
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function render() {
  const state = runtimeState;
  const isActive = Boolean(state && state.active);
  startButton.disabled = isActive;
  stopButton.disabled = !isActive;

  const target = state ? state.targetCount : Number(document.getElementById('targetFollow').value) || 0;
  const actions = state ? state.actionsCount : 0;
  document.getElementById('progress').textContent = translate('progress')
    .replace('{done}', String(actions))
    .replace('{target}', String(target));
  document.getElementById('nextAction').textContent = formatCountdown(state && state.nextActionAt);

  let elapsedSeconds = 0;
  if (state && state.startedAt) {
    const endTime = state.finishedAt || Date.now();
    elapsedSeconds = (endTime - state.startedAt) / 1000;
  }
  document.getElementById('elapsed').textContent = formatClock(elapsedSeconds);

  const statusKey = state ? state.status : (Date.now() < manualStatusUntil ? manualStatusKey : 'ready');
  statusElement.dataset.statusKey = statusKey;
  statusElement.textContent = `${translate('statusPrefix')}: ${translate(statusKey)}`;
}

function isExtensionContext() {
  return typeof chrome !== 'undefined' && Boolean(chrome.tabs && chrome.scripting);
}

function isInstagramUrl(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname === 'instagram.com' || hostname.endsWith('.instagram.com');
  } catch {
    return false;
  }
}

async function getActiveInstagramTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || typeof tab.id !== 'number' || !isInstagramUrl(tab.url || '')) {
    return null;
  }
  return tab;
}

function readSettings() {
  const targetCount = Number(document.getElementById('targetFollow').value);
  const minDelay = Number(document.getElementById('minDelay').value);
  const maxDelay = Number(document.getElementById('maxDelay').value);
  const batchSize = Number(document.getElementById('batchCount').value);
  const restMinutes = Number(document.getElementById('restMinutes').value);
  const failurePauseMinutes = Number(document.getElementById('failurePause').value);
  const values = [targetCount, minDelay, maxDelay, batchSize, restMinutes, failurePauseMinutes];

  if (values.some(value => !Number.isInteger(value) || value < 1) ||
      targetCount > 200 ||
      minDelay > maxDelay ||
      minDelay > 3600 ||
      maxDelay > 3600 ||
      batchSize > 200 ||
      restMinutes > 1440 ||
      failurePauseMinutes > 1440) {
    return null;
  }

  return { targetCount, minDelay, maxDelay, batchSize, restMinutes, failurePauseMinutes };
}

startButton.addEventListener('click', async () => {
  const config = readSettings();
  if (!config) {
    setManualStatus('invalidSettings');
    return;
  }
  if (!isExtensionContext()) {
    setManualStatus('notExtension');
    return;
  }

  setManualStatus('starting');
  startButton.disabled = true;
  try {
    const tab = await getActiveInstagramTab();
    if (!tab) {
      setManualStatus('openInstagram');
      return;
    }

    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: runAutoFollow,
      args: [config]
    });
    const startResult = result && result[0] && result[0].result;
    if (!startResult || !startResult.started) {
      setManualStatus(startResult && startResult.reason === 'alreadyRunning' ? 'alreadyRunning' : 'failedStart');
      return;
    }
    await syncState();
  } catch (error) {
    console.error('Unable to start the follow process:', error);
    setManualStatus('failedStart');
  }
});

stopButton.addEventListener('click', async () => {
  if (!isExtensionContext()) {
    setManualStatus('notExtension');
    return;
  }
  setManualStatus('stopping');
  try {
    const tab = await getActiveInstagramTab();
    if (!tab) {
      setManualStatus('stopError');
      return;
    }
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: stopAutoFollow
    });
    const stopResult = result && result[0] && result[0].result;
    if (!stopResult || !stopResult.state) {
      setManualStatus('stopError');
      return;
    }
    runtimeState = stopResult.state;
    render();
  } catch (error) {
    console.error('Unable to stop the follow process:', error);
    setManualStatus('stopError');
  }
});

document.getElementById('idLangBtn').addEventListener('click', () => {
  language = 'id';
  localStorage.setItem('igAutoFollowLanguage', language);
  applyLanguage();
});
document.getElementById('enLangBtn').addEventListener('click', () => {
  language = 'en';
  localStorage.setItem('igAutoFollowLanguage', language);
  applyLanguage();
});
document.getElementById('limitsBtn').addEventListener('click', () => limitsDialog.showModal());
document.getElementById('closeLimitsBtn').addEventListener('click', () => limitsDialog.close());
document.getElementById('targetFollow').addEventListener('input', () => {
  if (!runtimeState) {
    render();
  }
});

async function syncState() {
  if (!isExtensionContext() || pollInProgress) {
    return;
  }
  pollInProgress = true;
  try {
    const tab = await getActiveInstagramTab();
    if (!tab) {
      runtimeState = null;
      if (Date.now() >= manualStatusUntil) {
        manualStatusKey = 'openInstagram';
      }
      render();
      return;
    }
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getAutoFollowState
    });
    runtimeState = result && result[0] ? result[0].result : null;
    if (!runtimeState) {
      manualStatusKey = 'ready';
      manualStatusUntil = 0;
    }
    render();
  } catch (error) {
    if (Date.now() - lastPollErrorAt > 30000) {
      console.error('Unable to read the follow process status:', error);
      lastPollErrorAt = Date.now();
    }
    runtimeState = null;
    if (Date.now() >= manualStatusUntil) {
      manualStatusKey = 'statusUnavailable';
    }
    render();
  } finally {
    pollInProgress = false;
  }
}

// Fungsi ini dijalankan pada tab Instagram untuk mengelola proses follow.
function runAutoFollow(config) {
  if (window.__igAutoFollowState && window.__igAutoFollowState.active) {
    return { started: false, reason: 'alreadyRunning' };
  }

  const state = {
    active: true,
    status: 'running',
    actionsCount: 0,
    targetCount: config.targetCount,
    startedAt: Date.now(),
    finishedAt: null,
    nextActionAt: null
  };
  window.__igAutoFollowState = state;

  const wait = async (durationMs, status) => {
    state.status = status;
    state.nextActionAt = Date.now() + durationMs;
    const endTime = state.nextActionAt;
    while (state.active && Date.now() < endTime) {
      await new Promise(resolve => setTimeout(resolve, Math.min(1000, endTime - Date.now())));
    }
    state.nextActionAt = null;
    return state.active;
  };

  const getFollowButtons = () => Array.from(document.querySelectorAll('button')).filter(button => {
    const text = button.innerText.trim().toLowerCase();
    return button.getClientRects().length > 0 &&
      !button.disabled &&
      (text === 'follow' || text === 'ikuti');
  });

  const hasRestrictionNotice = () => {
    const notices = Array.from(document.querySelectorAll('[role="alert"], [role="dialog"]'))
      .filter(element => element.getClientRects().length > 0)
      .map(element => (element.innerText || '').toLowerCase())
      .join(' ');
    return [
      'try again later',
      'action blocked',
      'we restrict certain activity',
      'coba lagi nanti',
      'tindakan diblokir',
      'kami membatasi aktivitas'
    ].some(message => notices.includes(message));
  };

  const scrollForMoreButtons = () => {
    const scrollableContainer = document.querySelector('div.x9f619.x1n2onr6.x1ja2u2z');
    if (scrollableContainer) {
      scrollableContainer.scrollBy(0, 300);
    } else {
      window.scrollBy(0, 300);
    }
  };

  (async () => {
    let emptyScans = 0;
    try {
      while (state.active && state.actionsCount < config.targetCount) {
        const buttons = getFollowButtons();
        if (buttons.length === 0) {
          if (emptyScans >= 7) {
            state.status = 'noTargets';
            state.active = false;
            break;
          }
          emptyScans++;
          scrollForMoreButtons();
          await wait(2000, 'waiting');
          continue;
        }

        emptyScans = 0;
        try {
          buttons[0].click();
          state.actionsCount++;
        } catch (error) {
          console.error('Unable to click a follow button:', error);
          await wait(config.failurePauseMinutes * 60 * 1000, 'failurePauseStatus');
          continue;
        }

        if (!await wait(1000, 'running') || !state.active) {
          break;
        }
        if (hasRestrictionNotice()) {
          if (!await wait(config.failurePauseMinutes * 60 * 1000, 'failurePauseStatus')) {
            break;
          }
        }

        if (state.actionsCount >= config.targetCount) {
          state.status = 'completed';
          state.active = false;
          break;
        }

        if (state.actionsCount % config.batchSize === 0) {
          if (!await wait(config.restMinutes * 60 * 1000, 'resting')) {
            break;
          }
        } else {
          const delay = Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1) + config.minDelay) * 1000;
          if (!await wait(delay, 'waiting')) {
            break;
          }
        }
      }
    } catch (error) {
      console.error('The follow process stopped unexpectedly:', error);
      state.status = 'error';
      state.active = false;
    } finally {
      if (state.active) {
        state.status = 'completed';
        state.active = false;
      }
      state.finishedAt = Date.now();
      state.nextActionAt = null;
    }
  })();

  return { started: true };
}

function stopAutoFollow() {
  const state = window.__igAutoFollowState;
  if (state && state.active) {
    state.active = false;
    state.status = 'stopped';
    state.nextActionAt = null;
  }
  return { state: state ? { ...state } : null };
}

function getAutoFollowState() {
  const state = window.__igAutoFollowState;
  return state ? { ...state } : null;
}

applyLanguage();
render();
setInterval(() => {
  render();
  void syncState();
}, 1000);
void syncState();
