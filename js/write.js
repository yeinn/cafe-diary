/* =========================================================
   write.js — 기록 작성 · 수정
   ---------------------------------------------------------
   write.html            → 새 기록 (오늘 날짜)
   write.html?date=...   → 그 날짜로 새 기록
   write.html?id=...     → 기존 기록 수정
   ========================================================= */

const MAX_PHOTOS = 3;
const MAX_NOTES = 5;

/* 새 한줄평 — 아이콘과 색은 무작위로 미리 정해 둬요 (색은 이미 쓴 색을 피해서) */
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
function newNote(existing = []) {
  const used = existing.map((n) => n.color);
  const free = NOTE_COLORS.filter((c) => !used.includes(c));
  return { text: '', icon: pickRandom(NOTE_ICON_CHOICES), color: pickRandom(free.length ? free : NOTE_COLORS) };
}

const editingId = getParam('id');
const original = editingId ? getRecord(editingId) : null;

/* ---------- 입력값 상태 ---------- */
const form = {
  date: getParam('date') || todayKey(),
  weather: '',
  revisit: false,
  photos: [],
  cover: '',
  notes: [newNote()],
  openIconPicker: -1,      // 아이콘 선택창이 열린 한줄평 번호 (-1: 닫힘)
};

/* ---------- 요소 ---------- */
const $ = (id) => document.getElementById(id);
const el = {
  form: $('recordForm'),
  pageTitle: $('pageTitle'),
  closeBtn: $('closeBtn'),
  dateLabel: $('dateLabel'),
  dateInput: $('dateInput'),
  weatherBtns: document.querySelectorAll('[data-weather]'),
  cafe: $('cafeInput'),
  cafeList: $('cafeList'),
  visitHint: $('visitHint'),
  drink: $('drinkInput'),
  dessert: $('dessertInput'),
  menuHint: $('menuHint'),
  revisitChip: $('revisitChip'),
  detailToggle: $('detailToggle'),
  detailFields: $('detailFields'),
  photoGrid: $('photoGrid'),
  photoInput: $('photoInput'),
  coverBtn: $('coverBtn'),
  coverInput: $('coverInput'),
  bookTitle: $('bookTitleInput'),
  bookPages: $('bookPagesInput'),
  quote: $('quoteInput'),
  diary: $('diaryInput'),
  addNoteBtn: $('addNoteBtn'),
  noteList: $('noteList'),
  saveBtn: $('saveBtn'),
};

let isDirty = false;   // 작성 중인 내용이 있는지 (닫을 때 확인용)

/* =========================================================
   그리기
   ========================================================= */

/* 날짜 */
function renderDate() {
  el.dateLabel.textContent = formatMonthDayWeek(form.date);
  el.dateInput.value = form.date;
}

/* 날씨 */
function renderWeather() {
  el.weatherBtns.forEach((btn) => {
    const on = btn.dataset.weather === form.weather;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', on);
  });
}

/* 다시 가고 싶은 카페 */
function renderRevisit() {
  el.revisitChip.classList.toggle('is-active', form.revisit);
  el.revisitChip.setAttribute('aria-pressed', form.revisit);
}

/* 첫 방문 안내 — '처음 기록하는 카페예요' / 'n번째 방문이에요' */
function renderVisitHint() {
  const name = normalizeName(el.cafe.value);
  if (!name) {
    el.visitHint.innerHTML = '';
    return;
  }
  const before = loadRecords().filter((r) =>
    r.id !== editingId &&
    normalizeName(r.cafe) === name &&
    r.date <= form.date
  ).length;

  el.visitHint.innerHTML = before === 0
    ? `${badgeNewHtml()}처음 기록하는 카페예요`
    : `${before + 1}번째 방문이에요`;
}

/* 사진 */
function renderPhotos() {
  const thumbs = form.photos.map((src, i) => `
    <div class="photo-thumb">
      <img src="${src}" alt="첨부한 사진 ${i + 1}">
      <button type="button" class="remove-btn" data-remove-photo="${i}" aria-label="사진 ${i + 1} 삭제">
        <i data-icon="close"></i>
      </button>
    </div>`).join('');

  const addTile = form.photos.length < MAX_PHOTOS
    ? `<button type="button" class="photo-add" id="photoAddBtn">
         <i data-icon="camera"></i>${form.photos.length} / ${MAX_PHOTOS}
       </button>`
    : '';

  el.photoGrid.innerHTML = thumbs + addTile;
  renderIcons(el.photoGrid);
}

/* 책 표지 */
function renderCover() {
  el.coverBtn.classList.toggle('has-image', !!form.cover);
  el.coverBtn.innerHTML = form.cover
    ? `<img src="${form.cover}" alt="책 표지">`
    : '<i data-icon="plus"></i>';
  renderIcons(el.coverBtn);
}

/* 한줄평 포스트잇 */
function renderNotes() {
  el.noteList.innerHTML = form.notes.map((note, i) => `
    <div class="postit postit--${note.color}">
      <div class="note-icon-wrap">
        <button type="button" class="note-icon-btn" data-icon-pick="${i}"
          aria-label="한줄평 ${i + 1} 아이콘 바꾸기" aria-haspopup="true" aria-expanded="${form.openIconPicker === i}">
          <i data-icon="${note.icon}"></i>
        </button>
        ${form.openIconPicker === i ? `
        <div class="note-icon-picker" role="listbox" aria-label="아이콘 선택">
          ${NOTE_ICON_CHOICES.map((name) => `
          <button type="button" class="note-icon-option${name === note.icon ? ' is-selected' : ''}"
            role="option" aria-selected="${name === note.icon}" data-icon-choose="${name}" data-note-index="${i}">
            <i data-icon="${name}"></i>
          </button>`).join('')}
        </div>` : ''}
      </div>
      <input type="text" value="${escapeHtml(note.text)}" data-note="${i}"
        placeholder="오늘을 한 줄로 남긴다면?" maxlength="60" aria-label="한줄평 ${i + 1}">
      ${form.notes.length > 1
        ? `<button type="button" class="note-remove" data-remove-note="${i}" aria-label="한줄평 ${i + 1} 삭제"><i data-icon="close"></i></button>`
        : ''}
    </div>`).join('');
  el.addNoteBtn.hidden = form.notes.length >= MAX_NOTES;
  renderIcons(el.noteList);
}

/* 저장 버튼 켜기/끄기 — 카페 이름 + (음료 또는 디저트) */
function validate() {
  const hasCafe = el.cafe.value.trim() !== '';
  const hasMenu = el.drink.value.trim() !== '' || el.dessert.value.trim() !== '';
  el.saveBtn.disabled = !(hasCafe && hasMenu);
  el.menuHint.classList.toggle('is-warning', hasCafe && !hasMenu);
}

/* 더 자세히 기록하기 펼치기/접기 */
function setDetailOpen(open) {
  el.detailToggle.setAttribute('aria-expanded', open);
  el.detailFields.hidden = !open;
}

/* 글 길이에 맞춰 입력칸 높이 늘리기 */
function autoGrow(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

/* =========================================================
   수정 모드 — 기존 기록 채워 넣기
   ========================================================= */
function fillForm(record) {
  el.pageTitle.textContent = '기록 수정';
  document.title = '기록 수정 · 카페일기';
  el.saveBtn.textContent = '수정 완료';

  form.date = record.date;
  form.weather = record.weather || '';
  form.revisit = !!record.revisit;
  form.photos = [...(record.photos || [])];
  form.cover = record.book?.cover || '';
  form.notes = record.notes?.length ? record.notes.map((n) => ({ ...n })) : [newNote()];

  el.cafe.value = record.cafe || '';
  el.drink.value = record.drink || '';
  el.dessert.value = record.dessert || '';
  el.bookTitle.value = record.book?.title || '';
  el.bookPages.value = record.book?.pages || '';
  el.quote.value = record.quote || '';
  el.diary.value = record.diary || '';

  const hasDetail = form.photos.length || record.book || record.quote || record.diary || record.notes?.length;
  setDetailOpen(!!hasDetail);
}

/* 전에 기록한 카페 이름을 자동완성 목록으로 */
function fillCafeSuggestions() {
  const names = [...new Set(loadRecords().map((r) => r.cafe.trim()))];
  el.cafeList.innerHTML = names.map((n) => `<option value="${escapeHtml(n)}">`).join('');
}

/* =========================================================
   저장
   ========================================================= */
function buildRecord() {
  const bookTitle = el.bookTitle.value.trim();
  const bookPages = el.bookPages.value.trim();
  const hasBook = bookTitle || bookPages || form.cover;

  return {
    id: original ? original.id : createId(),
    date: form.date,
    weather: form.weather,
    cafe: el.cafe.value.trim(),
    drink: el.drink.value.trim(),
    dessert: el.dessert.value.trim(),
    revisit: form.revisit,
    photos: form.photos,
    book: hasBook ? { title: bookTitle, pages: bookPages, cover: form.cover } : null,
    quote: el.quote.value.trim(),
    diary: el.diary.value.trim(),
    notes: form.notes
      .map((n) => ({ text: n.text.trim(), icon: n.icon, color: n.color }))
      .filter((n) => n.text),
    createdAt: original ? original.createdAt : Date.now(),
  };
}

el.form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (el.saveBtn.disabled) return;
  const record = buildRecord();
  if (upsertRecord(record)) {
    isDirty = false;
    showAlert(
      original ? '기록이 수정되었습니다.' : '새 기록이 등록되었습니다.',
      () => { location.href = `detail.html?id=${record.id}`; }
    );
  }
});

/* =========================================================
   이벤트
   ========================================================= */

// 날짜 바꾸기
el.dateInput.addEventListener('change', () => {
  if (!el.dateInput.value) return;
  form.date = el.dateInput.value;
  renderDate();
  renderVisitHint();
  isDirty = true;
});

// 날씨 (한 번 더 누르면 해제)
el.weatherBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    form.weather = form.weather === btn.dataset.weather ? '' : btn.dataset.weather;
    renderWeather();
    isDirty = true;
  });
});

// 카페 이름 · 음료 · 디저트
el.cafe.addEventListener('input', () => { renderVisitHint(); validate(); });
el.drink.addEventListener('input', validate);
el.dessert.addEventListener('input', validate);

// 다시 가고 싶은 카페
el.revisitChip.addEventListener('click', () => {
  form.revisit = !form.revisit;
  renderRevisit();
  isDirty = true;
});

// 더 자세히 기록하기
el.detailToggle.addEventListener('click', () => {
  setDetailOpen(el.detailFields.hidden);
  autoGrow(el.quote);
  autoGrow(el.diary);
});

// 사진 추가 · 삭제
el.photoGrid.addEventListener('click', (e) => {
  if (e.target.closest('#photoAddBtn')) el.photoInput.click();
  const remove = e.target.closest('[data-remove-photo]');
  if (remove) {
    form.photos.splice(Number(remove.dataset.removePhoto), 1);
    renderPhotos();
  }
});
el.photoInput.addEventListener('change', async () => {
  const files = [...el.photoInput.files].slice(0, MAX_PHOTOS - form.photos.length);
  for (const file of files) {
    try {
      form.photos.push(await resizeImage(file, 1080, 0.78));
    } catch (err) {
      showAlert('사진을 불러오지 못했어요.\n다른 사진으로 시도해 주세요.');
    }
  }
  el.photoInput.value = '';
  renderPhotos();
  isDirty = true;
});

// 책 표지
el.coverBtn.addEventListener('click', () => el.coverInput.click());
el.coverInput.addEventListener('change', async () => {
  const file = el.coverInput.files[0];
  if (!file) return;
  form.cover = await resizeImage(file, 320, 0.8);
  el.coverInput.value = '';
  renderCover();
  isDirty = true;
});

// 문장 · 글쓰기 높이 자동 조절
[el.quote, el.diary].forEach((ta) => ta.addEventListener('input', () => autoGrow(ta)));

// 한줄평
el.addNoteBtn.addEventListener('click', () => {
  form.notes.push(newNote(form.notes));
  form.openIconPicker = -1;
  renderNotes();
  el.noteList.querySelector(`[data-note="${form.notes.length - 1}"]`).focus();
});
el.noteList.addEventListener('input', (e) => {
  if (e.target.dataset.note !== undefined) form.notes[e.target.dataset.note].text = e.target.value;
});
el.noteList.addEventListener('click', (e) => {
  const choose = e.target.closest('[data-icon-choose]');
  if (choose) {
    form.notes[Number(choose.dataset.noteIndex)].icon = choose.dataset.iconChoose;
    form.openIconPicker = -1;
    isDirty = true;
    renderNotes();
    return;
  }
  const pick = e.target.closest('[data-icon-pick]');
  if (pick) {
    const i = Number(pick.dataset.iconPick);
    form.openIconPicker = form.openIconPicker === i ? -1 : i;
    renderNotes();
    return;
  }
  const remove = e.target.closest('[data-remove-note]');
  if (!remove) return;
  form.notes.splice(Number(remove.dataset.removeNote), 1);
  form.openIconPicker = -1;
  renderNotes();
});
// 선택창 바깥을 누르거나 Esc를 누르면 닫기
document.addEventListener('click', (e) => {
  // (목록을 다시 그리면 e.target이 화면에서 떨어져 나가므로 composedPath로 확인)
  const inside = e.composedPath().some((n) => n.classList && n.classList.contains('note-icon-wrap'));
  if (form.openIconPicker !== -1 && !inside) {
    form.openIconPicker = -1;
    renderNotes();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && form.openIconPicker !== -1) {
    form.openIconPicker = -1;
    renderNotes();
  }
});

// 무언가 입력하면 '작성 중' 표시
el.form.addEventListener('input', () => { isDirty = true; });

// 닫기
el.closeBtn.addEventListener('click', () => {
  const leave = () => {
    isDirty = false;
    location.href = original ? `detail.html?id=${original.id}` : 'index.html';
  };
  if (isDirty) showConfirm('작성 중인 내용이 저장되지 않아요.\n나갈까요?', leave, '나가기', '계속 쓰기');
  else leave();
});

// 저장 안 하고 페이지를 떠날 때 브라우저 경고
window.addEventListener('beforeunload', (e) => {
  if (isDirty) e.preventDefault();
});

/* =========================================================
   시작
   ========================================================= */
if (editingId && !original) {
  showAlert('수정할 기록을 찾지 못했어요.', () => { location.href = 'index.html'; });
}
if (original) fillForm(original);

fillCafeSuggestions();
renderDate();
renderWeather();
renderRevisit();
renderVisitHint();
renderPhotos();
renderCover();
renderNotes();
validate();
renderIcons();
