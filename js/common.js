/* =========================================================
   common.js — 모든 화면에서 같이 쓰는 도구 모음
   ========================================================= */

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/* 모바일 화면인지 (CSS의 1023px 기준과 같아요) */
function isMobile() {
  return window.matchMedia('(max-width: 1023px)').matches;
}

/* ---------- 날짜 ---------- */

/* Date → '2026-10-30' */
function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* '2026-10-30' → Date */
function fromDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function todayKey() {
  return toDateKey(new Date());
}

/* '10월 30일' */
function formatMonthDay(key) {
  const d = fromDateKey(key);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/* '10월 30일 금요일' */
function formatMonthDayWeek(key) {
  const d = fromDateKey(key);
  return `${formatMonthDay(key)} ${WEEKDAYS[d.getDay()]}요일`;
}

/* '2026년 10월 30일 금요일' */
function formatFullDate(key) {
  const d = fromDateKey(key);
  return `${d.getFullYear()}년 ${formatMonthDayWeek(key)}`;
}

/* ---------- 글자 ---------- */

/* 사용자가 쓴 글을 HTML에 안전하게 넣기 */
function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* 받침에 따라 조사 고르기 — particle('라떼', '을', '를') → '를' */
function particle(word, withBatchim, withoutBatchim) {
  const last = (word || '').trim().slice(-1);
  const code = last.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return withoutBatchim;
  return code % 28 > 0 ? withBatchim : withoutBatchim;
}

/* 주소창의 ?id=... 값 읽기 */
function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

/* '아이스 아메리카노 · 까눌레' */
function menuText(record) {
  return [record.drink, record.dessert].filter(Boolean).join(' · ');
}

/* ---------- 공통 UI 조각 ---------- */

/* NEW 뱃지 */
function badgeNewHtml(extraClass = '') {
  return `<span class="badge-new ${extraClass}" role="img" aria-label="첫 방문">${iconSvg('badge-new')}</span>`;
}

/* 기록 목록 한 줄 (RecordItem 컴포넌트) */
function recordItemHtml(record, allRecords) {
  const photo = record.photos && record.photos[0];
  const thumb = photo
    ? `<img src="${photo}" alt="">`
    : `<i data-icon="coffee"></i>`;
  const isNew = isFirstVisit(record, allRecords);

  return `
    <li>
      <a class="record-item" href="detail.html?id=${record.id}">
        <span class="record-thumb">${thumb}</span>
        <span class="record-info">
          <span class="record-date">${formatMonthDay(record.date)}</span>
          <span class="record-name">
            <span class="ellipsis">${escapeHtml(record.cafe)}</span>
            ${isNew ? badgeNewHtml() : ''}
          </span>
          <span class="record-menu ellipsis">${escapeHtml(menuText(record))}</span>
        </span>
        <i data-icon="chevron-right" class="icon-18 record-arrow"></i>
      </a>
    </li>`;
}

/* ---------- 사진 줄이기 ----------
   큰 사진을 그대로 저장하면 저장 공간이 금방 가득 차서
   긴 변을 maxSize(px)로 줄이고 JPEG로 압축해 저장합니다. */
function resizeImage(file, maxSize = 1080, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ---------- 알림창 ---------- */

/* 알림창 공통 틀. buttons: [{ text, cls, value }], 닫히면 onClose(누른 value) 실행
   X · 바깥 · Esc 는 value 가 null (취소) */
function openAlert(message, buttons, onClose) {
  const root = document.createElement('div');
  root.className = 'alert';
  root.setAttribute('role', 'alertdialog');
  root.setAttribute('aria-modal', 'true');
  root.innerHTML = `
    <div class="alert-dim"></div>
    <div class="alert-panel">
      <button type="button" class="alert-x" aria-label="닫기"><i data-icon="close"></i></button>
      <p class="alert-message">${escapeHtml(message)}</p>
      <div class="alert-actions">
        ${buttons.map((b, i) => `<button type="button" class="btn ${b.cls}" data-i="${i}">${escapeHtml(b.text)}</button>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(root);
  if (typeof renderIcons === 'function') renderIcons();

  let done = false;
  const close = (value) => {
    if (done) return;
    done = true;
    document.removeEventListener('keydown', onKey);
    root.remove();
    if (onClose) onClose(value);
  };
  const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(null); } };
  document.addEventListener('keydown', onKey);
  root.querySelector('.alert-dim').addEventListener('click', () => close(null));
  root.querySelector('.alert-x').addEventListener('click', () => close(null));
  root.querySelectorAll('.alert-actions .btn').forEach((btn) => {
    btn.addEventListener('click', () => close(buttons[Number(btn.dataset.i)].value));
  });
  root.querySelector('.alert-actions .btn-primary').focus();
}

/* 안내창: 닫히면(X · 닫기 · 바깥 · Esc) onClose 실행 */
function showAlert(message, onClose) {
  openAlert(message, [{ text: '닫기', cls: 'btn-primary', value: true }], () => { if (onClose) onClose(); });
}

/* 확인창: '확인' 버튼을 눌렀을 때만 onConfirm 실행 */
function showConfirm(message, onConfirm, confirmText = '확인', cancelText = '취소') {
  openAlert(
    message,
    [
      { text: cancelText, cls: 'btn-secondary', value: false },
      { text: confirmText, cls: 'btn-primary', value: true },
    ],
    (ok) => { if (ok) onConfirm(); }
  );
}
