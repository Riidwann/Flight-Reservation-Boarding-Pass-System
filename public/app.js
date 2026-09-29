// Format currency IDR
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

// Reset Database API call
async function resetDatabase() {
  if (!confirm('Apakah Anda yakin ingin mereset database ke kondisi awal? Seluruh booking dan check-in akan dihapus.')) {
    return;
  }
  try {
    const res = await fetch('/api/system/reset', { method: 'POST' });
    const data = await res.json();
    alert('✅ ' + data.message);
    window.location.reload();
  } catch (err) {
    alert('Gagal mereset database: ' + err.message);
  }
}

// Search flights
async function handleSearch(e) {
  if (e) e.preventDefault();
  const origin = document.getElementById('originSelect').value;
  const destination = document.getElementById('destSelect').value;
  const listContainer = document.getElementById('flightList');

  listContainer.innerHTML = '<p>Sedang mencari penerbangan...</p>';

  try {
    const res = await fetch(`/api/flights?origin=${origin}&destination=${destination}`);
    const flights = await res.json();

    if (!res.ok) {
      listContainer.innerHTML = `<div class="alert alert-danger">Error: ${flights.error}</div>`;
      return;
    }

    if (!Array.isArray(flights) || flights.length === 0) {
      listContainer.innerHTML = `
        <div class="card" style="text-align: center; padding: 2rem;">
          <p style="font-size: 1.1rem; color: var(--text-muted);">
            Tidak ditemukan penerbangan langsung dari <strong>${origin}</strong> ke <strong>${destination}</strong>.
          </p>
        </div>`;
      return;
    }

    listContainer.innerHTML = flights.map(f => `
      <div class="flight-card">
        <div>
          <div style="font-weight: 700; color: var(--primary); font-size: 1.1rem;">
            ${f.airline} &bull; <span style="background: #e2e8f0; padding: 2px 8px; border-radius: 4px;">${f.flightNumber}</span>
          </div>
          <div class="flight-times" style="margin-top: 0.8rem;">
            <div class="time-node">
              <div class="time">${f.departureTime}</div>
              <div class="city">${f.origin}</div>
            </div>
            <div class="flight-duration">&rarr; Langsung &rarr;</div>
            <div class="time-node">
              <div class="time">${f.arrivalTime}</div>
              <div class="city">${f.destination}</div>
            </div>
          </div>
          <div style="margin-top: 0.6rem; font-size: 0.88rem; color: var(--text-muted);">
            Sisa Kursi: <strong style="color: ${f.availableSeats < 5 ? '#ef4444' : '#10b981'};">${f.availableSeats}</strong> / ${f.totalSeats}
          </div>
        </div>

        <div style="text-align: right;">
          <div class="flight-price">${formatRupiah(f.price)}</div>
          <div style="margin-top: 0.8rem;">
            <a href="/seats.html?flightNumber=${f.flightNumber}" class="btn">
              Pilih Kursi &rarr;
            </a>
          </div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    listContainer.innerHTML = `<div class="alert alert-danger">Koneksi gagal: ${err.message}</div>`;
  }
}

// Auto search on initial load
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('searchForm')) {
    handleSearch();
  }
});
