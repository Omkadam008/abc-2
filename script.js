const display = document.getElementById('display');
const ops = document.querySelectorAll('.op[data-op]');

let current = '0', stored = null, operator = null;

function formatNumber(value) {
  if (value === 'Error') return value;
  const [i, d] = value.split('.');
  const f = Number(i).toLocaleString();
  return d ? `${f}.${d}` : f;
}

function update(v) { display.textContent = formatNumber(v); }
function clearOps() { ops.forEach(b => b.classList.remove('active')); }

function input(v) {
  if (v === '.' && current.includes('.')) return;
  current = current === '0' ? v : current + v;
  update(current);
}

function clearAll() {
  current = '0'; stored = null; operator = null;
  clearOps(); update(current);
}

function setOp(op, btn) {
  stored = Number(current);
  operator = op;
  current = '0';
  clearOps();
  if (btn) btn.classList.add('active');
}

function equals() {
  if (!operator) return;
  const a = stored, b = Number(current);
  let r;
  switch (operator) {
    case '+': r = a + b; break;
    case '-': r = a - b; break;
    case '*': r = a * b; break;
    case '/': r = b === 0 ? 'Error' : a / b; break;
  }
  current = String(r);
  operator = null;
  clearOps(); update(current);
}

function percent() { current = String(Number(current) / 100); update(current); }
function sign() { current = String(Number(current) * -1); update(current); }

// Click handling
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.op) setOp(btn.dataset.op, btn);
    else if (btn.dataset.action === 'clear') clearAll();
    else if (btn.dataset.action === 'equals') equals();
    else if (btn.dataset.action === 'percent') percent();
    else if (btn.dataset.action === 'sign') sign();
    else input(btn.textContent);
  });
});

// Keyboard support
document.addEventListener('keydown', e => {
  if (/\d/.test(e.key)) input(e.key);
  if ('+-*/'.includes(e.key)) {
    const btn = [...ops].find(b => b.dataset.op === e.key);
    setOp(e.key, btn);
  }
  if (e.key === 'Enter' || e.key === '=') equals();
  if (e.key === 'Escape') clearAll();
  if (e.key === '%') percent();
  if (e.key === '.') input('.');
});
