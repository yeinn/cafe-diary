/* =========================================================
   taste.js — 취향 아카이브 (쌓인 기록으로 집계)
   ========================================================= */

const STAMP_SLOTS = 8;            // 도장판 칸 수
const body = document.getElementById('tasteBody');
const filterButtons = document.querySelectorAll('[data-range]');
let range = 'month';              // 'all' 전체 | 'year' 올해 | 'month' 이번 달

/* ---------- 기간에 맞는 기록만 고르기 ---------- */
function filterByRange(list) {
  const now = new Date();
  const y = String(now.getFullYear());
  const ym = todayKey().slice(0, 7);          // '2026-11'
  if (range === 'year') return list.filter((r) => r.date.startsWith(y));
  if (range === 'month') return list.filter((r) => r.date.startsWith(ym));
  return list;
}

/* ---------- 많이 나온 순서로 세기 ----------
   countBy(기록들, r => r.drink) → [{ name:'아이스 라떼', count:7, records:[...] }, ...] */
function countBy(list, pick) {
  const map = new Map();
  list.forEach((r) => {
    const value = (pick(r) || '').trim();
    if (!value) return;
    const key = normalizeName(value);
    if (!map.has(key)) map.set(key, { name: value, count: 0, records: [] });
    const item = map.get(key);
    item.count += 1;
    item.records.push(r);
  });
  return [...map.values()].sort((a, b) =>
    b.count - a.count || (b.records.at(-1).date > a.records.at(-1).date ? 1 : -1)
  );
}

/* '156 – 192쪽' → 37쪽,  '32쪽' → 32쪽 */
function pagesRead(text) {
  if (!text) return 0;
  const span = text.match(/(\d+)\s*[–\-~]\s*(\d+)/);
  if (span) return Math.max(0, Number(span[2]) - Number(span[1]) + 1);
  const single = text.match(/\d+/);
  return single ? Number(single[0]) : 0;
}

/* 1 → '한' (책 한 권) */
function koreanCount(n) {
  return ['', '한', '두', '세', '네', '다섯'][n] || String(n);
}

/* ---------- 섹션별 HTML ---------- */

/* 이달의 나 — 한 줄 메시지 */
function messageHtml(list, drinks, books, cafes) {
  const now = new Date();
  const label = { month: `${now.getMonth() + 1}월의 나`, year: `${now.getFullYear()}년의 나`, all: '지금까지의 나' }[range];
  // 문장 끝맺음: '…한 달이에요.' / '…한 해예요.' / '…했어요.'
  const ending = { month: (s) => `${s} 한 달이에요.`, year: (s) => `${s} 한 해예요.`, all: null }[range];

  let text;
  const topDrink = drinks[0]?.name;
  const drinkObj = topDrink ? `${topDrink}${particle(topDrink, '을', '를')}` : '';

  if (topDrink && books.length) {
    const head = `책 ${koreanCount(books.length)} 권과 ${drinkObj} 곁에 두고 머문 시간이 많았던`;
    text = ending ? ending(head) : `책 ${koreanCount(books.length)} 권과 ${drinkObj} 곁에 두고 머문 시간이 많았어요.`;
  } else if (topDrink) {
    const head = `${cafes[0].name}에서 ${drinkObj} 자주 마신`;
    text = ending ? ending(head) : `${cafes[0].name}에서 ${drinkObj} 자주 마셨어요.`;
  } else {
    text = `카페에서 보낸 시간을 ${list.length}번 기록했어요.`;
  }

  return `
    <div class="message-card">
      <small>${label}</small>
      <p>${escapeHtml(text)}</p>
    </div>`;
}

/* 방문한 카페 · 함께한 책 숫자 */
function statsHtml(cafes, books) {
  return `
    <div class="stat-row">
      <div class="stat-card"><span><i data-icon="coffee"></i>방문한 카페</span><strong>${cafes.length}</strong></div>
      <div class="stat-card"><span><i data-icon="book"></i>함께한 책</span><strong>${books.length}</strong></div>
    </div>`;
}

/* 자주 간 카페 — 도장판 (상위 2곳) */
function stampsHtml(cafes) {
  const top = cafes.slice(0, 2);
  const cafeHtml = (c) => {
    const stamps = Array.from({ length: STAMP_SLOTS }, (_, i) =>
      i < c.count
        ? '<span class="stamp is-filled"><i data-icon="cup"></i></span>'
        : '<span class="stamp"></span>'
    ).join('');
    return `
      <div class="stamp-cafe">
        <div class="stamp-cafe-head"><strong class="ellipsis">${escapeHtml(c.name)}</strong><span>${c.count}회</span></div>
        <div class="stamps">${stamps}</div>
      </div>`;
  };

  return `
    <section class="taste-section">
      <div class="section-head">
        <h2 class="section-title">자주 간 카페</h2>
        <p class="section-desc">방문할 때마다 도장이 하나씩 찍혀요</p>
      </div>
      <div class="stamp-box">${top.map(cafeHtml).join('')}</div>
    </section>`;
}

/* 자주 마신 음료 · 자주 먹은 디저트 — 1위 크게 + 2·3위 */
function rankHtml(title, items, unit, kind) {
  if (!items.length) return '';
  const [first, ...rest] = items.slice(0, 3);
  return `
    <section class="taste-section">
      <h2 class="section-title">${title}</h2>
      <div class="rank-row">
        <div class="rank-first">
          <span class="rank-illust"><img src="${illustSrc(kind, first.name)}" alt=""></span>
          <div class="rank-first-info">
            <span class="rank-label">1위</span>
            <span class="rank-first-name">${escapeHtml(first.name)}<span class="count-pill">${first.count}${unit}</span></span>
          </div>
        </div>
        ${rest.map((item, i) => `
          <div class="rank-other">
            <span class="rank-label">${i + 2}위</span>
            <span class="rank-other-name">${escapeHtml(item.name)}</span>
            <span class="count-pill">${item.count}${unit}</span>
          </div>`).join('')}
      </div>
    </section>`;
}

/* 다시 가고 싶은 카페 — 사진 3장 */
function revisitHtml(list) {
  const cafes = countBy(list.filter((r) => r.revisit), (r) => r.cafe).slice(0, 3);
  if (!cafes.length) return '';

  return `
    <section class="taste-section">
      <div class="revisit-head">
        <h2 class="section-title">다시 가고 싶은 카페</h2>
      </div>
      <div class="revisit-grid">
        ${cafes.map((c) => {
          const latest = [...c.records].sort(byOldest).reverse();
          const withPhoto = latest.find((r) => r.photos?.length);
          const photo = withPhoto
            ? `<img src="${withPhoto.photos[0]}" alt="">`
            : '<i data-icon="coffee"></i>';
          return `
            <a class="revisit-card" href="detail.html?id=${(withPhoto || latest[0]).id}">
              <span class="revisit-photo">${photo}</span>
              <span class="ellipsis">${escapeHtml(c.name)}</span>
            </a>`;
        }).join('')}
      </div>
    </section>`;
}

/* 함께한 책 */
function booksHtml(books) {
  if (!books.length) return '';
  return `
    <section class="taste-section">
      <h2 class="section-title">함께한 책</h2>
      <ul class="book-list">
        ${books.map((b) => {
          const pages = b.records.reduce((sum, r) => sum + pagesRead(r.book.pages), 0);
          const cover = [...b.records].reverse().find((r) => r.book.cover)?.book.cover;
          const meta = [pages ? `총 ${pages}쪽` : '', `기록 ${b.count}회`].filter(Boolean).join(' · ');
          return `
            <li class="book-row">
              <span class="book-cover">${cover ? `<img src="${cover}" alt="">` : '<i data-icon="book"></i>'}</span>
              <span class="book-row-info">
                <strong>${escapeHtml(b.name)}</strong>
                <span>${meta}</span>
              </span>
            </li>`;
        }).join('')}
      </ul>
    </section>`;
}

/* ---------- 화면 그리기 ---------- */
function render() {
  const list = filterByRange(loadRecords()).sort(byOldest);

  if (!list.length) {
    const word = { month: '이번 달', year: '올해', all: '아직' }[range];
    body.innerHTML = `
      <div class="empty">
        ${word === '아직' ? '아직 기록이 없어요.' : `${word}에는 아직 기록이 없어요.`}<br>
        카페에 다녀온 날을 기록하면 이곳에 취향이 쌓여요.
      </div>`;
    return;
  }

  const cafes = countBy(list, (r) => r.cafe);
  const drinks = countBy(list, (r) => r.drink);
  const desserts = countBy(list, (r) => r.dessert);
  const books = countBy(list.filter((r) => r.book?.title), (r) => r.book.title);

  body.innerHTML = `
    <section class="taste-section">
      ${messageHtml(list, drinks, books, cafes)}
      ${statsHtml(cafes, books)}
    </section>
    ${stampsHtml(cafes)}
    ${rankHtml('자주 마신 음료', drinks, '잔', 'drink')}
    ${rankHtml('자주 먹은 디저트', desserts, '개', 'dessert')}
    ${revisitHtml(list)}
    ${booksHtml(books)}`;

  renderIcons(body);
}

/* 기간 버튼 */
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    range = btn.dataset.range;
    filterButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
    render();
  });
});

renderIcons();
render();
