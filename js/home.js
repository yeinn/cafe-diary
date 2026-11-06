/* =========================================================
   home.js — 홈 (캘린더 · 오늘의 기록 · 모든 기록)
   ========================================================= */

/* ---------- 화면 상태 ---------- */
const state = {
  view: 'month',          // 'month' 월간 | 'week' 주간
  cursor: new Date(),     // 지금 보고 있는 달(또는 주)의 기준 날짜
  selected: todayKey(),   // 선택한 날짜 (처음엔 오늘)
  newestFirst: true,      // 모든 기록 정렬: 최신순
};

let records = loadRecords();

/* ---------- 자주 쓰는 요소 ---------- */
const el = {
  periodTitle: document.getElementById('periodTitle'),
  days: document.getElementById('days'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  viewButtons: document.querySelectorAll('[data-view]'),
  dayPanelTitle: document.getElementById('dayPanelTitle'),
  dayPanel: document.getElementById('dayPanel'),
  listTitle: document.getElementById('listTitle'),
  listMeta: document.getElementById('listMeta'),
  sortBtn: document.getElementById('sortBtn'),
  sortLabel: document.getElementById('sortLabel'),
  recordList: document.getElementById('recordList'),
  sheet: document.getElementById('sheet'),
  sheetContent: document.getElementById('sheetContent'),
};

/* 날짜별로 기록 묶기 → { '2026-10-30': [기록, 기록] } */
function groupByDate(list) {
  const map = {};
  list.forEach((r) => {
    (map[r.date] = map[r.date] || []).push(r);
  });
  Object.values(map).forEach((arr) => arr.sort(byOldest));
  return map;
}

/* 지금 화면에 보여줄 날짜 목록 (빈칸은 null) */
function getVisibleKeys() {
  const y = state.cursor.getFullYear();
  const m = state.cursor.getMonth();

  if (state.view === 'month') {
    const firstDay = new Date(y, m, 1).getDay();       // 1일의 요일
    const lastDate = new Date(y, m + 1, 0).getDate();  // 그 달의 마지막 날
    const keys = Array(firstDay).fill(null);
    for (let d = 1; d <= lastDate; d++) keys.push(toDateKey(new Date(y, m, d)));
    return keys;
  }

  // 주간: 일요일부터 토요일까지
  const start = new Date(y, m, state.cursor.getDate() - state.cursor.getDay());
  return Array.from({ length: 7 }, (_, i) =>
    toDateKey(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
  );
}

/* ---------- 1. 캘린더 ---------- */
function renderCalendar() {
  const byDate = groupByDate(records);
  const keys = getVisibleKeys();
  const today = todayKey();

  // 제목: '2026년 10월' 또는 '10월 25일 – 31일'
  if (state.view === 'month') {
    el.periodTitle.textContent = `${state.cursor.getFullYear()}년 ${state.cursor.getMonth() + 1}월`;
  } else {
    const first = fromDateKey(keys[0]);
    const last = fromDateKey(keys[6]);
    const end = first.getMonth() === last.getMonth()
      ? `${last.getDate()}일`
      : `${last.getMonth() + 1}월 ${last.getDate()}일`;
    el.periodTitle.textContent = `${first.getMonth() + 1}월 ${first.getDate()}일 – ${end}`;
  }

  el.days.innerHTML = keys.map((key) => {
    if (!key) return '<div class="day is-blank"></div>';

    const date = fromDateKey(key);
    const dayRecords = byDate[key] || [];
    const hasNew = dayRecords.some((r) => isFirstVisit(r, records));

    const classes = ['day'];
    if (dayRecords.length) classes.push('has-record');
    if (key === today) classes.push('is-today');
    if (key === state.selected) classes.push('is-selected');
    if (date.getDay() === 0) classes.push('is-sun');

    const label = `${formatMonthDayWeek(key)}${key === today ? ' (오늘)' : ''}, 기록 ${dayRecords.length}개`;

    return `
      <button type="button" class="${classes.join(' ')}" data-key="${key}" aria-label="${label}">
        <span class="day-cup">
          <i data-icon="cup"></i>
          ${hasNew ? badgeNewHtml() : ''}
        </span>
        <span class="day-num">${date.getDate()}</span>
      </button>`;
  }).join('');

  renderIcons(el.days);
}

/* ---------- 2. 선택한 날의 기록 카드 ---------- */
function dayCardHtml(key) {
  const dayRecords = groupByDate(records)[key] || [];
  const addLink = `write.html?date=${key}`;

  if (!dayRecords.length) {
    return `
      <div class="day-card">
        <div class="day-card-head">
          <span class="day-card-date">${formatMonthDayWeek(key)}</span>
        </div>
        <a class="btn-add-day is-empty" href="${addLink}">
          <i data-icon="plus" class="icon-18"></i>
          아직 기록이 없어요. 이 날을 기록해 보세요!
        </a>
      </div>`;
  }

  return `
    <div class="day-card">
      <div class="day-card-head">
        <span class="day-card-date">${formatMonthDayWeek(key)}</span>
        <span class="day-card-count">기록 ${dayRecords.length}개</span>
      </div>
      <ul class="record-list">
        ${dayRecords.map((r) => recordItemHtml(r, records)).join('')}
      </ul>
      <a class="btn-add-day" href="${addLink}">
        <i data-icon="plus" class="icon-18"></i>이 날짜에 기록 추가
      </a>
    </div>`;
}

function renderDayPanel() {
  el.dayPanelTitle.textContent =
    state.selected === todayKey() ? '오늘의 기록' : `${formatMonthDay(state.selected)}의 기록`;
  el.dayPanel.innerHTML = dayCardHtml(state.selected);
  renderIcons(el.dayPanel);
}

/* ---------- 3. 모든 기록 / 이번 주 기록 ---------- */
const LIST_LIMIT = 8;   // 목록에 한 번에 보여줄 최대 개수
let currentList = [];   // 지금 목록의 전체 기록 (전체보기용)

function renderList() {
  let list;

  if (state.view === 'week') {
    const keys = getVisibleKeys();
    const isThisWeek = keys.includes(todayKey());
    list = records.filter((r) => keys.includes(r.date)).sort(byOldest);
    el.listTitle.textContent = isThisWeek ? '이번 주 기록' : '이 주의 기록';
    el.listMeta.textContent = `기록 ${list.length}개`;
    el.listMeta.hidden = false;
    el.sortBtn.hidden = true;
  } else {
    list = [...records].sort(byOldest);
    if (state.newestFirst) list.reverse();
    el.listTitle.textContent = '모든 기록';
    el.sortLabel.textContent = state.newestFirst ? '최신순' : '오래된순';
    el.listMeta.hidden = true;
    el.sortBtn.hidden = false;
  }

  if (!list.length) {
    el.recordList.innerHTML = records.length
      ? '<li class="empty">이 주에는 기록이 없어요.</li>'
      : `<li class="empty">
           아직 기록이 없어요. 첫 카페 기록을 남겨 보세요.<br>
           <button type="button" class="empty-action" id="sampleBtn">예시 기록으로 둘러보기</button>
         </li>`;
  } else {
    const shown = list.slice(0, LIST_LIMIT);
    el.recordList.innerHTML = shown.map((r) => recordItemHtml(r, records)).join('');
    if (list.length > LIST_LIMIT) {
      el.recordList.innerHTML += `<li class="view-all-wrap">
        <button type="button" class="view-all-btn" id="viewAllBtn">전체보기 (${list.length}개)</button>
      </li>`;
    }
  }
  currentList = list;
  renderIcons(el.recordList);
}

function renderAll() {
  renderCalendar();
  renderDayPanel();
  renderList();
}

/* ---------- 바텀시트 (모바일) ---------- */
function openSheet(key) {
  el.sheet.classList.remove('is-closing');
  el.sheetContent.innerHTML = dayCardHtml(key);
  renderIcons(el.sheetContent);
  el.sheet.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeSheet() {
  if (el.sheet.classList.contains('is-closing')) return;  // 중복 클릭 방지
  el.sheet.classList.add('is-closing');
  setTimeout(() => {
    el.sheet.hidden = true;
    el.sheet.classList.remove('is-closing');
    document.body.style.overflow = '';
  }, 250);   // CSS의 0.25s와 같은 값
}


/* ---------- 이벤트 ---------- */

// 날짜 누르기
el.days.addEventListener('click', (e) => {
  const day = e.target.closest('.day[data-key]');
  if (!day) return;
  state.selected = day.dataset.key;
  renderCalendar();
  renderDayPanel();
  if (isMobile()) openSheet(state.selected);
});

// 이전 / 다음
function move(step) {
  const c = state.cursor;
  state.cursor = state.view === 'month'
    ? new Date(c.getFullYear(), c.getMonth() + step, 1)
    : new Date(c.getFullYear(), c.getMonth(), c.getDate() + step * 7);
  renderCalendar();
  renderList();
}
el.prevBtn.addEventListener('click', () => move(-1));
el.nextBtn.addEventListener('click', () => move(1));

// 월 / 주 전환
el.viewButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    state.view = btn.dataset.view;
    state.cursor = fromDateKey(state.selected);   // 선택한 날짜가 있는 달/주로
    el.viewButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
    renderCalendar();
    renderList();
  });
});

// 정렬 (최신순 ↔ 오래된순)
el.sortBtn.addEventListener('click', () => {
  state.newestFirst = !state.newestFirst;
  renderList();
});

// 전체보기 (바텀시트로 전체 목록 열기)
el.recordList.addEventListener('click', (e) => {
  if (!e.target.closest('#viewAllBtn')) return;
  el.sheetContent.innerHTML = `
    <div class="day-card-head"><span class="day-card-date">${el.listTitle.textContent}</span>
    <span class="day-card-count">총 ${currentList.length}개</span></div>
    <ul class="record-list">${currentList.map((r) => recordItemHtml(r, records)).join('')}</ul>`;
  renderIcons(el.sheetContent);
  el.sheet.hidden = false;
  document.body.style.overflow = 'hidden';
});

// 예시 기록 불러오기
el.recordList.addEventListener('click', (e) => {
  if (e.target.id !== 'sampleBtn') return;
  if (resetSampleRecords()) {
    records = loadRecords();
    renderAll();
  }
});

// 바텀시트 닫기 (바깥 누르기 · Esc · PC 크기로 바뀔 때)
el.sheet.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closeSheet();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !el.sheet.hidden) closeSheet();
});
window.addEventListener('resize', () => {
  if (!isMobile() && !el.sheet.hidden) closeSheet();
});

/* ---------- 시작 ---------- */
renderIcons();
renderAll();
