/* ===== IST CLOCK ===== */
function getIST() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 5.5 * 3600000);
}

function updateMarketClock() {
  const ist = getIST();
  const hh = String(ist.getHours()).padStart(2, '0');
  const mm = String(ist.getMinutes()).padStart(2, '0');
  const ss = String(ist.getSeconds()).padStart(2, '0');
  const el = document.getElementById('mkt-clock');
  if (el) el.textContent = hh + ':' + mm + ':' + ss;
  updateMarketStatus(ist);
}

function updateMarketStatus(ist) {
  const dot  = document.getElementById('mkt-dot');
  const text = document.getElementById('mkt-status-text');
  if (!dot || !text) return;

  const day = ist.getDay(); // 0=Sun, 6=Sat
  const h = ist.getHours();
  const m = ist.getMinutes();
  const mins = h * 60 + m;
  const open  = 9 * 60 + 15;   // 09:15 IST
  const close = 15 * 60 + 30;  // 15:30 IST

  const isWeekday = day >= 1 && day <= 5;
  const isOpen = isWeekday && mins >= open && mins < close;

  if (isOpen) {
    dot.className  = 'mkt-dot open';
    text.className = 'mkt-status-text open';
    text.textContent = 'Market Open';
  } else {
    dot.className  = 'mkt-dot closed';
    text.className = 'mkt-status-text closed';
    text.textContent = day === 0 || day === 6 ? 'Market Closed (Weekend)' : 'Market Closed';
  }
}

updateMarketClock();
setInterval(updateMarketClock, 1000);

/* ===== MOVERS TABS ===== */
document.querySelectorAll('.movers-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.movers-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.movers-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('movers-' + tab.dataset.tab).classList.add('active');
  });
});

/* ===== STOCK SEARCH ===== */
function openStockChart(sym) {
  if (!sym) return;
  const clean = sym.trim().toUpperCase().replace(/\s+/g, '');
  const symbol = clean.includes(':') ? clean : 'NSE:' + clean;
  const url = 'https://www.tradingview.com/chart/?symbol=' + encodeURIComponent(symbol);
  window.open(url, '_blank', 'noopener');
}

document.getElementById('stock-search-btn').addEventListener('click', () => {
  const val = document.getElementById('stock-input').value;
  openStockChart(val);
});

document.getElementById('stock-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    openStockChart(e.target.value);
  }
});

document.querySelectorAll('.stock-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    openStockChart(chip.dataset.sym);
  });
});
