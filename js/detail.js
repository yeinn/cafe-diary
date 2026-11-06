/* =========================================================
   detail.js — 기록 상세 (detail.html?id=...)
   ========================================================= */

const WEATHER_LABEL = { sunny: '맑음', cloud: '흐림', rain: '비', snow: '눈' };

const recordId = getParam('id');
const record = getRecord(recordId);
const container = document.getElementById('detail');

/* ---------- 섹션별 HTML ---------- */

/* 사진 슬라이더 */
function sliderHtml(photos) {
  if (!photos || !photos.length) return '';
  const many = photos.length > 1;
  return `
    <div class="slider" id="slider">
      <div class="slider-track" id="sliderTrack">
        ${photos.map((src, i) => `<img src="${src}" alt="기록 사진 ${i + 1}">`).join('')}
      </div>
      ${many ? `
        <button type="button" class="slider-arrow prev" data-slide="-1" aria-label="이전 사진"><i data-icon="chevron-left" class="icon-18"></i></button>
        <button type="button" class="slider-arrow next" data-slide="1" aria-label="다음 사진"><i data-icon="chevron-right" class="icon-18"></i></button>
        <span class="slider-count" id="sliderCount">1 / ${photos.length}</span>` : ''}
    </div>
    ${many ? `<div class="dots" id="dots">${photos.map(() => '<span></span>').join('')}</div>` : ''}`;
}

/* 날짜 · 카페 이름 */
function headHtml(r, all) {
  const weather = r.weather
    ? `<i data-icon="${r.weather}" aria-label="${WEATHER_LABEL[r.weather]}"></i>`
    : '';
  return `
    <div class="detail-head">
      <p class="detail-date">${formatFullDate(r.date)} ${weather}</p>
      <h2 class="detail-name">${escapeHtml(r.cafe)} ${isFirstVisit(r, all) ? badgeNewHtml() : ''}</h2>
    </div>`;
}

/* 음료 · 디저트 (PC 2단, 모바일 세로) */
function menuHtml(r) {
  const cell = (label, value) => `
    <div class="menu-cell">
      <span class="menu-label">${label}</span>
      <span class="menu-value ${value ? '' : 'is-empty'}">${value ? escapeHtml(value) : '–'}</span>
    </div>`;
  return `<div class="menu-box">${cell('음료', r.drink)}${cell('디저트', r.dessert)}</div>`;
}

/* 다시 가고 싶은 카페 */
function revisitHtml(r) {
  if (!r.revisit) return '';
  return `<span class="chip chip-revisit is-active"><i data-icon="heart" class="icon-14"></i>다시 가고 싶은 카페</span>`;
}

/* 오늘 함께한 책 */
function bookHtml(book) {
  if (!book) return '';
  const cover = book.cover ? `<img src="${book.cover}" alt="">` : '<i data-icon="book"></i>';
  return `
    <section class="book-block">
      <h3 class="book-block-title"><i data-icon="book" class="icon-18"></i>오늘 함께한 책</h3>
      <div class="book-block-body">
        <div class="book-cover">${cover}</div>
        <div class="book-info">
          <strong>${escapeHtml(book.title || '제목 없는 책')}</strong>
          ${book.pages ? `<span>${escapeHtml(book.pages)}</span>` : ''}
        </div>
      </div>
    </section>`;
}

/* 인상 깊은 문장 */
function quoteHtml(text) {
  if (!text) return '';
  return `
    <section class="detail-section">
      <h3>인상 깊은 문장</h3>
      <div class="quote-wrap">
        <div class="quote-card">
          <i data-icon="quote"></i>
          <p class="quote-text">${escapeHtml(text)}</p>
        </div>
      </div>
    </section>`;
}

/* 오늘의 글쓰기 */
function diaryHtml(text) {
  if (!text) return '';
  return `
    <section class="detail-section">
      <h3>오늘의 글쓰기</h3>
      <p class="lined">${escapeHtml(text)}</p>
    </section>`;
}

/* 한줄평 */
function notesHtml(notes) {
  if (!notes || !notes.length) return '';
  return `
    <section class="detail-section">
      <h3>한줄평</h3>
      <div class="postit-list">
        ${notes.map((n) => `
          <div class="postit postit--${n.color}"><i data-icon="${n.icon}"></i><span>${escapeHtml(n.text)}</span></div>`).join('')}
      </div>
    </section>`;
}

/* ---------- 화면 그리기 ---------- */
function render() {
  if (!record) {
    container.innerHTML = `
      <div class="not-found">
        기록을 찾지 못했어요. 삭제되었거나 다른 브라우저에서 작성한 기록일 수 있어요.<br>
        <a href="index.html">홈으로 돌아가기</a>
      </div>`;
    return;
  }

  const all = loadRecords();
  document.title = `${record.cafe} · 카페일기`;

  container.innerHTML = `
    ${sliderHtml(record.photos)}
    <div class="detail-body">
      ${headHtml(record, all)}
      ${menuHtml(record)}
      ${revisitHtml(record)}
      ${bookHtml(record.book)}
      ${quoteHtml(record.quote)}
      ${diaryHtml(record.diary)}
      ${notesHtml(record.notes)}
    </div>
    <div class="bottom-bar">
      <button type="button" class="btn btn-secondary" id="deleteBtn">삭제하기</button>
      <a class="btn btn-primary" href="write.html?id=${record.id}">수정하기</a>
    </div>`;

  renderIcons();
  setupSlider();

  document.getElementById('deleteBtn').addEventListener('click', () => {
    showConfirm('이 기록을 삭제할까요?\n삭제한 기록은 되돌릴 수 없어요.', () => {
      if (deleteRecord(record.id)) {
        showAlert('기록이 삭제되었습니다.', () => { location.href = 'index.html'; });
      }
    }, '삭제하기', '취소');
  });
}

/* ---------- 사진 넘기기 (버튼 · 스와이프) ---------- */
function setupSlider() {
  const slider = document.getElementById('slider');
  const track = document.getElementById('sliderTrack');
  if (!slider || record.photos.length < 2) return;

  const total = record.photos.length;
  const count = document.getElementById('sliderCount');
  const dots = document.querySelectorAll('#dots span');
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');
  let index = 0;

  function go(i) {
    index = Math.max(0, Math.min(total - 1, i));
    track.style.transform = `translateX(-${index * 100}%)`;
    count.textContent = `${index + 1} / ${total}`;
    dots.forEach((d, n) => d.classList.toggle('is-active', n === index));
    prev.disabled = index === 0;
    next.disabled = index === total - 1;
  }

  slider.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-slide]');
    if (btn) go(index + Number(btn.dataset.slide));
  });

  // 손가락으로 넘기기
  let startX = null;
  slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) go(index + (diff < 0 ? 1 : -1));
    startX = null;
  });

  go(0);
}

/* 뒤로 가기 — 이전 페이지가 수정 화면이면 홈으로 */
document.getElementById('backBtn').addEventListener('click', () => {
  const from = document.referrer;
  if (from && from.includes(location.host) && !from.includes('write.html')) history.back();
  else location.href = 'index.html';
});

render();
