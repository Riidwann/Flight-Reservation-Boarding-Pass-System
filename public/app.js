// Format currency IDR
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

// City code dictionary for friendly names
const airportNames = {
  'CGK': { city: 'Jakarta', airport: 'Soekarno-Hatta Int\'l' },
  'SUB': { city: 'Surabaya', airport: 'Juanda International' },
  'DPS': { city: 'Bali / Denpasar', airport: 'Ngurah Rai Int\'l' },
  'JOG': { city: 'Yogyakarta', airport: 'YIA Kulon Progo' },
  'KNO': { city: 'Medan', airport: 'Kualanamu International' },
  'UPG': { city: 'Makassar', airport: 'Sultan Hasanuddin Int\'l' }
};

// Toast Notification Manager
function showToast(type, title, message, duration = 4000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✅',
    error: '⚠️',
    info: 'ℹ️'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// Custom Modal Dialog (Replaces native confirm)
function showConfirmModal({ title, message, confirmText = 'Konfirmasi', confirmClass = 'btn-primary', onConfirm }) {
  const existing = document.getElementById('customModalBackdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'customModalBackdrop';
  backdrop.className = 'modal-backdrop';

  backdrop.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
      </div>
      <div class="modal-body">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" id="modalBtnCancel">Batal</button>
        <button type="button" class="btn ${confirmClass}" id="modalBtnConfirm">${confirmText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => {
    backdrop.remove();
  };

  backdrop.querySelector('#modalBtnCancel').onclick = close;
  backdrop.querySelector('#modalBtnConfirm').onclick = () => {
    close();
    if (typeof onConfirm === 'function') onConfirm();
  };
}

// 1-Click Copy Helper
function copyToClipboard(text, successMsg = 'Teks berhasil disalin ke clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('success', 'Berhasil Disalin', successMsg);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('success', 'Berhasil Disalin', successMsg);
  } catch (err) {
    showToast('error', 'Gagal Menyalin', 'Silakan salin teks secara manual: ' + text);
  }
  document.body.removeChild(textArea);
}

// Reset Database API call with Custom Modal
function resetDatabase() {
  showConfirmModal({
    title: '🔄 Reset Data Penerbangan',
    message: 'Apakah Anda yakin ingin mengembalikan seluruh jadwal dan status kursi ke kondisi awal? Data pemesanan saat ini akan dikosongkan.',
    confirmText: 'Ya, Reset Data',
    confirmClass: 'btn-danger',
    onConfirm: async () => {
      try {
        const res = await fetch('/api/system/reset', { method: 'POST' });
        const data = await res.json();
        showToast('success', 'Database Direset', data.message || 'Database berhasil dikembalikan ke kondisi awal.');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err) {
        showToast('error', 'Gagal Reset', 'Koneksi gagal: ' + err.message);
      }
    }
  });
}

// Search flights with modern cards & visual cues
async function handleSearch(e) {
  if (e) e.preventDefault();
  const originSelect = document.getElementById('originSelect');
  const destSelect = document.getElementById('destSelect');
  if (!originSelect || !destSelect) return;

  const origin = originSelect.value;
  const destination = destSelect.value;
  const listContainer = document.getElementById('flightList');
  if (!listContainer) return;

  listContainer.innerHTML = `
    <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
      <div style="font-size: 2rem; margin-bottom: 0.5rem; animation: pulse 1s infinite;">✈️</div>
      <p style="font-weight: 600;">Mencari penerbangan terbaik untuk rute Anda...</p>
    </div>
  `;

  try {
    const res = await fetch(`/api/flights?origin=${origin}&destination=${destination}`);
    const flights = await res.json();

    if (!res.ok) {
      listContainer.innerHTML = `
        <div class="alert alert-danger">
          ⚠️ <strong>Kesalahan:</strong> ${flights.error}
        </div>`;
      return;
    }

    if (!Array.isArray(flights) || flights.length === 0) {
      const origInfo = airportNames[origin] || { city: origin };
      const destInfo = airportNames[destination] || { city: destination };
      listContainer.innerHTML = `
        <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">🛫</div>
          <h3 style="color: var(--primary); margin-bottom: 0.5rem;">Penerbangan Langsung Tidak Tersedia</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem auto;">
            Saat ini tidak tersedia rute penerbangan langsung dari <strong>${origInfo.city} (${origin})</strong> ke <strong>${destInfo.city} (${destination})</strong>.
          </p>
          <button class="btn btn-outline btn-sm" onclick="swapOriginDest()">
            🔄 Tukar Rute Penerbangan
          </button>
        </div>`;
      return;
    }

    listContainer.innerHTML = flights.map(f => {
      const origInfo = airportNames[f.origin] || { city: f.origin, airport: '' };
      const destInfo = airportNames[f.destination] || { city: f.destination, airport: '' };
      const isLowSeat = f.availableSeats < 6;

      return `
        <div class="flight-card">
          <div style="flex: 1;">
            <div class="flight-header-row">
              <span class="airline-badge">
                ✈️ ${f.airline}
              </span>
              <span class="flight-chip">${f.flightNumber}</span>
              <span style="font-size: 0.78rem; color: var(--text-muted); background: #f1f5f9; padding: 2px 8px; border-radius: 4px;">Boeing 737-800</span>
            </div>

            <div class="flight-times">
              <div class="time-node">
                <div class="time">${f.departureTime}</div>
                <div class="city">${origInfo.city}</div>
                <div class="airport-code">${f.origin}</div>
              </div>

              <div class="flight-duration">
                <span class="duration-text">Langsung (Direct)</span>
                <div class="duration-line"></div>
                <span class="duration-text" style="color: #10b981; font-weight: 700;">Kelas Ekonomi</span>
              </div>

              <div class="time-node dest">
                <div class="time">${f.arrivalTime}</div>
                <div class="city">${destInfo.city}</div>
                <div class="airport-code">${f.destination}</div>
              </div>
            </div>

            <div class="flight-meta-row">
              <span class="seat-status-pill ${isLowSeat ? 'limited' : 'available'}">
                ${isLowSeat ? '🔥' : '💺'} ${f.availableSeats} kursi tersisa dari ${f.totalSeats}
              </span>
              <span style="font-size: 0.78rem; color: var(--text-muted);">&bull; Termasuk Bagasi Kabin 7kg</span>
            </div>
          </div>

          <div class="flight-price-box">
            <span class="flight-price-label">Mulai dari</span>
            <div class="flight-price">${formatRupiah(f.price)}</div>
            <span style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.5rem;">per penumpang / sekali jalan</span>
            <a href="/seats.html?flightNumber=${f.flightNumber}" class="btn">
              Pilih Kursi &rarr;
            </a>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    listContainer.innerHTML = `
      <div class="alert alert-danger">
        ⚠️ <strong>Koneksi Gagal:</strong> ${err.message}
      </div>`;
  }
}

// Swap origin and destination
function swapOriginDest() {
  const originSelect = document.getElementById('originSelect');
  const destSelect = document.getElementById('destSelect');
  if (originSelect && destSelect) {
    const temp = originSelect.value;
    originSelect.value = destSelect.value;
    destSelect.value = temp;
    handleSearch();
  }
}

// Auto search on initial load for search form
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('searchForm')) {
    handleSearch();
  }
});
