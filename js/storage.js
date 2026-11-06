/* =========================================================
   storage.js — 기록 저장소 (브라우저 localStorage 사용)
   ---------------------------------------------------------
   · 기록은 이 브라우저 안에만 저장됩니다.
     다른 브라우저·기기와 자동으로 공유되지 않고,
     브라우저 데이터(쿠키·사이트 데이터)를 지우면 함께 사라져요.
   · 저장 공간은 보통 5MB 정도라서 사진은 줄여서 저장합니다.

   기록 하나(record)의 모양
   {
     id:        'r...'            고유 번호
     date:      '2026-10-30'      방문 날짜
     weather:   'sunny' | 'cloud' | 'rain' | 'snow' | ''
     cafe:      '르슈망'            ✅ 필수
     drink:     '아이스 아메리카노'   ✅ 음료·디저트 중 하나 이상 필수
     dessert:   '까눌레'
     revisit:   true              다시 가고 싶은 카페
     photos:    ['data:image/jpeg;base64,...']   최대 3장
     book:      { title, pages, cover }
     quote:     '인상 깊은 문장'
     diary:     '오늘의 글쓰기'
     notes:     [{ text: '한줄평', icon: 'gift', color: 'butter' }, ...]   icon: 아이콘 이름, color: 포스트잇 색 이름 (icons.js)
     createdAt: 1730000000000     작성 시각
   }
   ========================================================= */

const STORAGE_KEY = 'cafeDiary.records.v1';
const NOTE_COLOR_RESHUFFLE_KEY = 'cafeDiary.noteColorsReshuffled';   // 포스트잇 색 일괄 재배정을 했는지

/* 한줄평 하나를 { text, icon, color } 모양으로 맞추기
   · 예전 기록은 문자열(또는 색 없음)이라, 아이콘은 예전 순서대로 붙이고
     색은 비워 둬요 (아래 loadRecords가 무작위로 정해서 저장) */
function normalizeNote(note, index) {
  const obj = note && typeof note === 'object' ? note : { text: note };
  return {
    text: String(obj.text || ''),
    icon: ICONS[obj.icon] ? obj.icon : DEFAULT_NOTE_ICONS[index % DEFAULT_NOTE_ICONS.length],
    color: NOTE_COLORS.includes(obj.color) ? obj.color : '',
  };
}

/* 색이 없는 한줄평에 무작위 색 주기 — 한 기록 안에서는 안 겹치게 (바뀌었으면 true) */
function fillNoteColors(notes) {
  let changed = false;
  notes.forEach((n) => {
    if (n.color) return;
    const free = NOTE_COLORS.filter((c) => !notes.some((m) => m.color === c));
    const pool = free.length ? free : NOTE_COLORS;
    n.color = pool[Math.floor(Math.random() * pool.length)];
    changed = true;
  });
  return changed;
}

/* 전체 기록 불러오기 */
function loadRecords() {
  try {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let changed = false;
    // 한 번만: 예전에 순서대로 박힌 포스트잇 색을 모두 지우고 무작위로 다시 정하기
    const reshuffle = localStorage.getItem(NOTE_COLOR_RESHUFFLE_KEY) !== 'done';
    records.forEach((r) => {
      if (!Array.isArray(r.notes)) return;
      r.notes = r.notes.map(normalizeNote);
      if (reshuffle) r.notes.forEach((n) => { n.color = ''; });
      if (fillNoteColors(r.notes)) changed = true;
    });
    // 색을 새로 정했다면 한 번만 저장해서, 다음부터는 같은 색으로 보이게
    if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    if (reshuffle) localStorage.setItem(NOTE_COLOR_RESHUFFLE_KEY, 'done');
    return records;
  } catch (err) {
    return [];
  }
}

/* 전체 기록 저장하기 (성공하면 true) */
function saveAllRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (err) {
    showAlert('브라우저 저장 공간이 가득 찼어요.\n사진 수를 줄이거나 오래된 기록을 정리한 뒤 다시 저장해 주세요.');
    return false;
  }
}

/* 기록 하나 찾기 */
function getRecord(id) {
  return loadRecords().find((r) => r.id === id) || null;
}

/* 새 기록 추가 또는 기존 기록 수정 */
function upsertRecord(record) {
  const records = loadRecords();
  const index = records.findIndex((r) => r.id === record.id);
  if (index >= 0) records[index] = record;
  else records.push(record);
  return saveAllRecords(records);
}

/* 기록 삭제 */
function deleteRecord(id) {
  return saveAllRecords(loadRecords().filter((r) => r.id !== id));
}

/* 새 고유 번호 만들기 */
function createId() {
  return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ---------- 카페 방문 계산 ---------- */

/* 카페 이름 비교용 (띄어쓰기·대소문자 차이 무시) */
function normalizeName(name) {
  return (name || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

/* 오래된 순 정렬 기준 (날짜 → 작성 시각) */
function byOldest(a, b) {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  return (a.createdAt || 0) - (b.createdAt || 0);
}

/* 이 기록이 그 카페의 '첫 방문'인지 → NEW 뱃지 표시 */
function isFirstVisit(record, records) {
  const sameCafe = records
    .filter((r) => normalizeName(r.cafe) === normalizeName(record.cafe))
    .sort(byOldest);
  return sameCafe.length > 0 && sameCafe[0].id === record.id;
}

/* ---------- 샘플 기록 (화면 확인용) ----------
   · 데이터는 js/sample-data.js 에 고정돼 있고, 사진은 js/sample-photos.js 설정을 따라요.
   · 저장소에 기록이 하나도 없는 '처음 한 번'만 자동으로 들어가요.
     (직접 다 지운 뒤에는 다시 들어오지 않아요)
   · 주소 뒤에 붙이는 명령 (아무 화면에서나 가능)
       ?sample=clear  → 샘플만 삭제 (내가 쓴 기록은 그대로)
       ?sample=reset  → 샘플만 지우고 새로 불러오기 (사진 설정을 바꾼 뒤에도 사용)
   · 샘플 기록을 수정하면 '내 기록'이 되어 샘플 삭제 때 지워지지 않아요. */

const SAMPLE_FLAG_KEY = 'cafeDiary.sampleSeeded.v1';

/* 고정 샘플 → 저장용 기록 (id · 작성 시각도 고정값이라 매번 똑같아요) */
function createSampleRecords() {
  const cafeOrder = {};
  let autoNo = 0;     // id 가 없는 샘플의 번호 (중간에 새 샘플을 끼워 넣어도 기존 id 가 바뀌지 않게)
  return SAMPLE_RECORDS.map((s, i) => {
    const slug = SAMPLE_CAFE_SLUGS[s.cafe];
    const pool = SAMPLE_PHOTO_COUNT[slug] || 0;
    const k = (cafeOrder[s.cafe] = (cafeOrder[s.cafe] ?? -1) + 1);   // 이 카페의 몇 번째 샘플인지
    const count = Math.min(s.photoCount || 0, pool);
    const photos = Array.from({ length: count }, (_, j) =>
      `${SAMPLE_PHOTO_DIR}${slug}-${((k + j) % pool) + 1}.jpg`);

    return {
      id: s.id || 'sample-' + String(++autoNo).padStart(2, '0'),
      date: s.date,
      weather: s.weather || '',
      cafe: s.cafe,
      drink: s.drink || '',
      dessert: s.dessert || '',
      revisit: !!s.revisit,
      photos,
      book: s.book ? { ...s.book, cover: SAMPLE_BOOK_COVERS[s.book.title] ? SAMPLE_COVER_DIR + SAMPLE_BOOK_COVERS[s.book.title] : '' } : null,
      quote: s.quote || '',
      diary: s.diary || '',
      notes: (s.notes || []).map((n) => ({ ...n })),
      createdAt: fromDateKey(s.date).getTime() + 12 * 3600000 + i * 60000,
      sample: true,
    };
  });
}

/* 샘플만 지우기 (내 기록은 그대로) */
function clearSampleRecords() {
  localStorage.setItem(SAMPLE_FLAG_KEY, '1');
  return saveAllRecords(loadRecords().filter((r) => !r.sample));
}

/* 샘플만 지우고 새로 넣기 */
function resetSampleRecords() {
  localStorage.setItem(SAMPLE_FLAG_KEY, '1');
  const mine = loadRecords().filter((r) => !r.sample);          // 수정한 샘플도 '내 기록'으로 남아 있어요
  const taken = new Set(mine.map((r) => r.id));                 // 같은 id 의 샘플은 건너뛰어 중복을 막아요
  return saveAllRecords([...mine, ...createSampleRecords().filter((r) => !taken.has(r.id))]);
}

/* 저장소에 기록이 없는 '처음 한 번'만 샘플 넣기 */
function seedSampleIfEmpty() {
  try {
    if (localStorage.getItem(SAMPLE_FLAG_KEY)) return;
    localStorage.setItem(SAMPLE_FLAG_KEY, '1');           // 이미 기록이 있어도 다시 시도하지 않아요
    if (loadRecords().length === 0) saveAllRecords(createSampleRecords());
  } catch (err) { /* 저장소를 못 쓰는 환경이면 샘플 없이 진행 */ }
}

/* 주소의 ?sample=clear | reset 처리 후 주소창을 깨끗하게 */
function handleSampleCommand() {
  try {
    const cmd = new URLSearchParams(location.search).get('sample');
    if (!cmd) return;
    if (cmd === 'clear') clearSampleRecords();
    else if (cmd === 'reset') resetSampleRecords();
    const url = new URL(location.href);
    url.searchParams.delete('sample');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  } catch (err) { /* 무시 */ }
}

handleSampleCommand();
seedSampleIfEmpty();
